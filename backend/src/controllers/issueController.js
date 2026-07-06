const Issue = require('../models/Issue');
const IssueStatus = require('../models/IssueStatus');
const { analyzeIssueImage } = require('../utils/verificationEngine');
const mongoose = require('mongoose');
const { getAddressFromCoordinates, getCoordinatesFromAddress } = require('../utils/geoService');
const { resolveZone, resolveZoneFromCoords } = require('../utils/zoneResolver');
const User = require('../models/User');

const Zone = require('../models/Zone');
const Notification = require('../models/Notification');

// @desc    Report an issue
// @route   POST /api/issues
// @access  Private (Citizen)
const createIssue = async (req, res) => {
    try {
        const { title, description, category, imageUrl, location, area, zone } = req.body;

        console.log(`[CreateIssue] Received Title: "${title}", Client Zone: "${zone}"`);

        // VALIDATE ZONE (MANDATORY)
        let effectiveZone = "Unassigned";

        if (location && location.lat && location.lng) {
            console.log(`[Issue Create] Incoming GPS: Lat ${location.lat}, Lng ${location.lng}, Accuracy: ${location.accuracy}m, Source: ${location.source}`);

            // DUPLICATE CHECK: Preventing "Double Taps" or Spam from same user
            // Logic: Block if User reported SAME Category at SAME Location (< 10m) within LAST 5 Minutes
            if (location.source !== 'Manual') {
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

                const recentIssues = await Issue.find({
                    reportedBy: req.user._id,
                    createdAt: { $gte: fiveMinutesAgo }
                });

                const isDuplicate = recentIssues.some(existing => {
                    if (existing.category !== category) return false; // Different category = New Issue (Allowed)

                    // Haversine Distance Calculation (Meters)
                    const R = 6371e3; // Earth radius in meters
                    const φ1 = existing.location.lat * Math.PI / 180;
                    const φ2 = location.lat * Math.PI / 180;
                    const Δφ = (location.lat - existing.location.lat) * Math.PI / 180;
                    const Δλ = (location.lng - existing.location.lng) * Math.PI / 180;

                    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = R * c;

                    console.log(`[Duplicate Check] Distance to Issue ${existing._id}: ${distance.toFixed(2)}m`);
                    return distance < 10; // 10 meters threshold
                });

                if (isDuplicate) {
                    console.warn(`[Issue Create] REJECTED: Duplicate issue detected (Same Category + <10m + <5mins).`);
                    return res.status(409).json({
                        message: "It looks like you just reported this issue. Verification is in progress.",
                        code: "DUPLICATE_REPORT"
                    });
                }
            }
        }

        if (zone) {
            // Verify if zone exists in DB
            const validZone = await Zone.findOne({ zoneName: zone });
            if (validZone) {
                effectiveZone = validZone.zoneName;
            } else {
                return res.status(400).json({ message: `Invalid Zone: ${zone}` });
            }
        } else {
            return res.status(400).json({ message: "Zone selection is required." });
        }


        // System Verification Step
        const verificationResult = await analyzeIssueImage(imageUrl, category);

        // 1. REVERSE GEOCODE (Backend Only - OSM/Nominatim)
        let resolvedLocation;
        try {
            resolvedLocation = await getAddressFromCoordinates(location.lat, location.lng);
        } catch (geoError) {
            console.error('GeoService Failed:', geoError);
            resolvedLocation = { // Final fallback
                fullAddress: `GPS: ${location.lat}, ${location.lng}`,
                state: 'Unknown', city: 'Unknown', locality: 'Unknown', pincode: '',
                lat: location.lat, lng: location.lng
            };
        }

        // 2. ZONE RESOLUTION (Manual Override)
        // We skip auto-resolution since user provided zone
        // const finalZone = await resolveZone(resolvedLocation.locality, resolvedLocation.city);

        // 3. AUTHORITY AUTO-ROUTING
        // Find an authority user responsible for this zone
        let authorityId = null;
        if (effectiveZone !== "Unassigned") {
            const assignedAuthority = await User.findOne({
                role: 'authority',
                zone: effectiveZone,
                isActive: true
            });
            if (assignedAuthority) authorityId = assignedAuthority._id;
        }

        console.log(`[Issue Service] Area: ${resolvedLocation.locality} -> Zone: ${effectiveZone} -> Auth: ${authorityId}`);

        // Validate source against enum
        const validSource = ['GPS', 'Manual', 'Wi-Fi/IP'].includes(location.source) ? location.source : 'GPS';

        const issue = await Issue.create({
            title,
            description,
            category,
            imageUrl,
            location: {
                lat: location.lat,
                lng: location.lng,
                fullAddress: resolvedLocation.fullAddress,
                locality: resolvedLocation.locality,
                city: resolvedLocation.city,
                state: resolvedLocation.state,
                pincode: resolvedLocation.pincode,
                accuracy: location.accuracy,
                source: validSource
            },
            priority: verificationResult.priority,
            systemVerified: verificationResult.verified,
            priorityLevel: verificationResult.priorityLevel || 0,
            verificationRemarks: verificationResult.remarks || '',
            reportedBy: req.user._id,
            createdById: req.user._id.toString(),
            createdByRole: 'CITIZEN',
            createdByEmail: req.user.email,
            status: 'Open',
            zone: effectiveZone,
            authorityId: authorityId,
            jurisdictionArea: effectiveZone // Legacy compatibility
        });

        // NOTIFICATION: Notify Authority if auto-assigned
        if (authorityId) {
            try {
                await Notification.create({
                    recipient: authorityId,
                    sender: req.user._id,
                    title: 'New Issue Reported',
                    message: `A new ${category} issue has been reported in your zone (${effectiveZone}).`,
                    type: 'alert'
                });
            } catch (notifErr) {
                console.warn('[Notification] Failed to send auto-assign alert:', notifErr.message);
            }
        }

        console.log(`✅ [DB SUCCESS] Issue Saved. ID: ${issue._id} | Zone: ${effectiveZone}`);

        // Create initial status log
        await IssueStatus.create({
            issueId: issue._id,
            status: 'Open',
            updatedBy: req.user._id,
            remarks: `Reported by citizen. Verification process complete.`
        });

        res.status(201).json(issue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all issues (Filterable)
// @route   GET /api/issues
// @access  Private
// @desc    Get all issues (Filterable & Paginated)
// @route   GET /api/issues
// @access  Private
const getIssues = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search, sortBy = 'createdAt', order = 'desc' } = req.query;
        let query = {};

        // Status Filter
        if (status && status !== 'All') query.status = status;

        // Search Filter (Title or Description)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (req.user.role === 'citizen') {
            const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const emailRegex = new RegExp(`^${escapeRegex(req.user.email)}$`, 'i');

            query.$or = [
                { createdById: req.user._id.toString() },
                { createdByCitizenId: req.user._id.toString() },
                { reportedBy: new mongoose.Types.ObjectId(req.user._id) },
                { createdByEmail: emailRegex }
            ];
        } else if (req.user.role === 'authority') {
            console.log(`[DEBUG] Authority Fetching Issues. User: ${req.user.email}, Zone: ${req.user.area}`);

            // Authority Filter: Match Jurisdiction OR Assigned Tasks
            const conditions = [];

            // 1. Matches Zone (Primary Authority Scope)
            if (req.user.zone) {
                // Check 'zone' field AND 'jurisdictionArea' for backward compatibility
                conditions.push({ zone: req.user.zone });
                conditions.push({ jurisdictionArea: req.user.zone });
            } else if (req.user.area) {
                // Fallback to legacy 'area' if zone not set on user
                conditions.push({ jurisdictionArea: req.user.area });
            } else {
                console.log('[DEBUG] WARNING: Authority user has no assigned zone/area!');
            }

            // 2. Directly Assigned to this Authority
            conditions.push({ assignedAuthorityId: req.user._id });
            conditions.push({ assignedTo: req.user._id }); // Handle legacy field if exists

            if (conditions.length > 0) {
                query.$or = conditions;
            } else {
                // Should not happen if logic is correct, but safe fallback logic
                query.assignedAuthorityId = req.user._id;
            }

            console.log('[DEBUG] Authority Query:', JSON.stringify(query));
        }

        const issues = await Issue.find(query)
            .populate('reportedBy', 'name email photoUrl')
            .populate('assignedAuthorityId', 'name email')
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Issue.countDocuments(query);

        // NORMALIZE RESPONSE (Task 1)
        const normalizedIssues = issues.map(doc => {
            const issue = doc.toObject();
            if (issue.location) {
                // Ensure Lat/Lng keys
                issue.location.latitude = issue.location.lat;
                issue.location.longitude = issue.location.lng;

                // Ensure Address key (Task 1: Normalize keys)
                if (!issue.location.address) {
                    issue.location.address = issue.location.fullAddress || `GPS: ${issue.location.lat}, ${issue.location.lng}`;
                }

                // Ensure numeric
                issue.location.lat = parseFloat(issue.location.lat);
                issue.location.lng = parseFloat(issue.location.lng);
            }
            return issue;
        });

        if (req.user.role === 'authority') {
            console.log(`[DEBUG] Matched ${total} records for Authority.`);
        }

        res.json({
            issues: normalizedIssues,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Assign Issue to Authority
// @route   PUT /api/issues/:id/assign
// @access  Private (Admin/Authority)
const assignIssue = async (req, res) => {
    try {
        const { authorityId } = req.body; // If admin assigns. If authority claims, use req.user._id
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Determine who is being assigned
        // If authority calls this, they claim it themselves.
        // If admin calls this, they assign to specific authorityId.
        const targetAuthorityId = (req.user.role === 'admin' && authorityId) ? authorityId : req.user._id;

        issue.assignedAuthorityId = targetAuthorityId;
        issue.assignedTo = targetAuthorityId; // Legacy support
        issue.status = 'In Progress'; // Auto-move to In Progress on assignment
        issue.updatedAt = Date.now();

        await issue.save();

        // Log Status
        await IssueStatus.create({
            issueId: issue._id,
            status: 'In Progress',
            updatedBy: req.user._id,
            remarks: `Task assigned to ${req.user.name}`
        });

        // NOTIFICATION: Notify Authority if assigned by Admin
        if (req.user.role === 'admin' && targetAuthorityId) {
            try {
                await Notification.create({
                    recipient: targetAuthorityId,
                    sender: req.user._id, // Admin
                    title: 'New Task Assigned',
                    message: `You have been assigned a new issue: ${issue.title}`,
                    type: 'info'
                });
            } catch (notifErr) {
                console.warn('[Notification] Failed to send assignment alert:', notifErr.message);
            }
        }

        res.json(issue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
const getIssueById = async (req, res) => {
    try {
        let issue = await Issue.findById(req.params.id)
            .populate('reportedBy', 'name email');

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // AUTO-RESOLVE ADDRESS IF MISSING (Task 3)
        // Check if location is "Unknown" or "Unmapped" but has valid Coords
        if (issue.location &&
            (issue.location.locality === 'Unknown' || issue.location.locality === 'Unmapped' || !issue.location.fullAddress) &&
            issue.location.lat && issue.location.lng) {

            console.log(`[GetIssue] Attempting to resolve address for ${issue._id}...`);
            try {
                const resolved = await getAddressFromCoordinates(issue.location.lat, issue.location.lng);

                // Update Issue with resolved data
                issue.location.fullAddress = resolved.fullAddress;
                issue.location.locality = resolved.locality;
                issue.location.city = resolved.city;
                issue.location.state = resolved.state;
                issue.location.pincode = resolved.pincode;

                // Save Back to DB (Cache)
                await issue.save();
                console.log(`[GetIssue] Address resolved and saved: ${resolved.locality}`);
            } catch (err) {
                console.error('[GetIssue] Failed to resolve address:', err.message);
                // Continue without failing request
            }
        }

        // Normalize Response Object
        const issueObj = issue.toObject();
        if (issueObj.location) {
            issueObj.location.address = issueObj.location.fullAddress || `GPS: ${issueObj.location.lat}, ${issueObj.location.lng}`;
            issueObj.location.latitude = issueObj.location.lat;
            issueObj.location.longitude = issueObj.location.lng;
        }

        // FETCH LATEST STATUS LOG FOR REMARKS
        // This allows displaying "Resolution Remarks" or "Rejection Reason" on the frontend
        const latestStatus = await IssueStatus.findOne({ issueId: issue._id }).sort({ createdAt: -1 });
        if (latestStatus) {
            issueObj.latestStatusLog = latestStatus;
            issueObj.resolutionRemarks = latestStatus.remarks; // Convenience field
        }

        // BACKFILL PRIORITY LEVEL FROM LOGS
        if (issueObj.priorityLevel === 0) {
            const allLogs = await IssueStatus.find({ issueId: issue._id }).select('remarks');
            for (const log of allLogs) {
                if (log.remarks) {
                    const match = log.remarks.match(/(?:Confidence|Score|System|Level).*?(\d+)%?/i);
                    if (match && match[1]) {
                        issueObj.priorityLevel = parseInt(match[1], 10);
                        console.log(`[GetIssue] Recovered Priority Level ${issueObj.priorityLevel} from log ${log._id} - Saving to DB...`);

                        // PERMANENT FIX: Save the recovered score to the database
                        await Issue.updateOne({ _id: issue._id }, { priorityLevel: issueObj.priorityLevel });

                        break; // Stop once found
                    }
                }
            }
        }

        res.json(issueObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateIssueStatus = async (req, res) => {
    try {
        const { status, remarks, resolutionImageUrl } = req.body;
        const issue = await Issue.findById(req.params.id);

        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        issue.status = status;
        if (resolutionImageUrl) {
            issue.resolutionImageUrl = resolutionImageUrl;
        }
        await issue.save();

        await IssueStatus.create({
            issueId: issue._id,
            status: status,
            updatedBy: req.user._id,
            remarks
        });

        // NOTIFICATION: Notify Citizen on Status Change
        if (issue.reportedBy) {
            try {
                await Notification.create({
                    recipient: issue.reportedBy,
                    sender: req.user._id,
                    title: `Issue ${status}`,
                    message: `Your issue '${issue.title}' has been marked as ${status}. ${remarks ? 'Remarks: ' + remarks : ''}`,
                    type: status === 'Resolved' ? 'success' : 'info'
                });
            } catch (notifErr) {
                console.warn('[Notification] Failed to send status update to citizen:', notifErr.message);
            }
        }

        res.json(issue);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete Issue
// @route   DELETE /api/issues/:id
// @access  Private/Admin
const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Optional: Check permissions (e.g., only admin/authority or owner can delete)
        // For now, assuming middleware handles role checks, or we can check req.user.role here

        await issue.deleteOne();
        res.json({ message: 'Issue removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Bulk Update Issues
// @route   PUT /api/issues/bulk
// @access  Private/Admin
const bulkUpdateIssues = async (req, res) => {
    try {
        const { issueIds, status, remarks } = req.body;

        if (!issueIds || !Array.isArray(issueIds) || issueIds.length === 0) {
            return res.status(400).json({ message: 'No issue IDs provided' });
        }

        // Update Issues
        await Issue.updateMany(
            { _id: { $in: issueIds } },
            { $set: { status, updatedAt: Date.now() } }
        );

        // Create Status Logs for each
        const statusLogs = issueIds.map(id => ({
            issueId: id,
            status,
            updatedBy: req.user._id,
            remarks: remarks || 'Bulk Update by Admin'
        }));

        await IssueStatus.insertMany(statusLogs);

        res.json({ message: `Successfully updated ${issueIds.length} issues to ${status}` });
    } catch (error) {
        console.error('Bulk Update Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createIssue = createIssue;
exports.getIssues = getIssues;
exports.getIssueById = getIssueById;
exports.updateIssueStatus = updateIssueStatus;
exports.bulkUpdateIssues = bulkUpdateIssues;
exports.deleteIssue = deleteIssue;
exports.assignIssue = assignIssue;

// @desc    Geocode Location
// @route   GET /api/issues/geocode
// @access  Private
const geocodeLocation = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        const resolved = await getAddressFromCoordinates(lat, lng);

        // 1. Try Accurate Geo-Polygon Match
        let zone = await resolveZoneFromCoords(lat, lng);

        // 2. Fallback to Text/Locality Match (if point matches no polygon)
        if (!zone && resolved.locality) {
            console.log(`[Geocode] Geo-match failed for (${lat},${lng}). Trying text match for "${resolved.locality}"...`);
            zone = await resolveZone(resolved.locality, resolved.city);
        }
        resolved.zone = zone || 'Outside Municipal Limits';

        res.json(resolved);
    } catch (error) {
        console.error('Geocode Error:', error);
        res.status(500).json({ message: 'Geocoding service failed' });
    }
};
exports.geocodeLocation = geocodeLocation;

// @desc    Search Location (Forward)
// @route   GET /api/issues/search-location
// @access  Private
const searchLocation = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: 'Query required' });

        const result = await getCoordinatesFromAddress(query);
        if (!result) return res.status(404).json({ message: 'Location not found' });

        // 1. Try Accurate Geo-Polygon Match
        let zone = await resolveZoneFromCoords(result.lat, result.lng);

        // 2. Fallback to Text Match
        if (!zone && result.locality) {
            console.log(`[Search] Geo-match fail. Trying text: ${result.locality}`);
            zone = await resolveZone(result.locality, result.city);
        }
        result.zone = zone || 'Outside Municipal Limits';

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Search failed' });
    }
};
exports.searchLocation = searchLocation;
