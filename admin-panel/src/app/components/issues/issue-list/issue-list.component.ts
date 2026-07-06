
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TableViewComponent, ColumnDef } from '../../../shared/components/table-view/table-view.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { IssueStatusDialogComponent } from '../issue-status-dialog/issue-status-dialog.component';
import { IssueViewDialogComponent } from '../issue-view-dialog/issue-view-dialog.component';

@Component({
    selector: 'app-issue-list',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDialogModule,
        TableViewComponent
    ],
    template: `
    <div class="page-content fade-in">
        <div class="filters-bar card-3d">
            <mat-form-field appearance="outline" class="search-field">
                <mat-icon matPrefix>search</mat-icon>
                <input matInput placeholder="Search issues..." [formControl]="searchControl">
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
                <mat-select [(ngModel)]="selectedStatus" (selectionChange)="loadIssues()">
                    <mat-option value="All">All Status</mat-option>
                    <mat-option value="Open">Open</mat-option>
                    <mat-option value="In Progress">In Progress</mat-option>
                    <mat-option value="Resolved">Resolved</mat-option>
                </mat-select>
            </mat-form-field>

            <button mat-icon-button class="refresh-btn" (click)="loadIssues()" [disabled]="isLoading">
                <mat-icon [class.spin]="isLoading">refresh</mat-icon>
            </button>
            
            <button class="btn-3d" *ngIf="selectedIssues.length > 0" (click)="openBulkUpdateModal()">
                Bulk Update ({{selectedIssues.length}})
            </button>
        </div>

        <app-table-view
            [data]="issues"
            [columns]="columns"
            [isLoading]="isLoading"
            [total]="totalIssues"
            [pageSize]="pageSize"
            [title]="'Reported Issues'"
            [actions]="['view', 'edit', 'delete']"
            (pageChange)="onPageChange($event)"
            (action)="handleAction($event)"
            (bulkAction)="handleBulkSelection($event)">
        </app-table-view>
    </div>
  `,
    styles: [`
    .page-content { padding: 32px; display: flex; flex-direction: column; gap: 24px; max-width: 1600px; margin: 0 auto; }
    .card-3d { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-light); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .filters-bar { padding: 16px 24px; display: flex; gap: 16px; align-items: center; }
    .search-field { flex-grow: 1; margin-bottom: -1.25em; }
    .filter-field { width: 200px; margin-bottom: -1.25em; }
    .refresh-btn { color: var(--secondary); }
    .btn-3d { 
        padding: 10px 20px; background: var(--secondary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
        box-shadow: 0 4px 0 #1e40af; transition: transform 0.1s;
    }
    .btn-3d:active { transform: translateY(2px); box-shadow: 0 2px 0 #1e40af; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    ::ng-deep .mat-mdc-select-value-text { color: var(--text-primary) !important; font-weight: 600; }
    ::ng-deep .mat-mdc-text-field-wrapper { background: var(--bg-surface-alt) !important; }
    ::ng-deep .mat-mdc-form-field-outline { color: var(--border-light) !important; }
    `]
})
export class IssueListComponent implements OnInit {
    adminService = inject(AdminService);
    toast = inject(ToastService);
    dialog = inject(MatDialog);
    router = inject(Router);
    cdr = inject(ChangeDetectorRef);

    issues: any[] = [];
    totalIssues = 0;
    pageSize = 10;
    currentPage = 1;
    searchControl = new FormControl('');
    selectedStatus = 'All';
    selectedIssues: any[] = [];
    isLoading = true;

    columns: ColumnDef[] = [
        { key: 'imageUrl', header: 'Image', type: 'image' },
        { key: 'title', header: 'Title' },
        { key: 'category', header: 'Category' },
        { key: 'location.address', header: 'Location' },
        { key: 'priority', header: 'Priority', type: 'badge', badgeColors: { 'high': 'red-badge', 'medium': 'orange-badge', 'low': 'green-badge' } },
        { key: 'status', header: 'Status', type: 'badge', badgeColors: { 'open': 'red-badge', 'in progress': 'blue-badge', 'resolved': 'green-badge' } },
        { key: 'createdAt', header: 'Reported', type: 'date' }
    ];

    ngOnInit() {
        this.loadIssues();
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            this.currentPage = 1;
            this.loadIssues();
        });
    }

    loadIssues() {
        this.isLoading = true;
        const query = this.searchControl.value || '';
        this.adminService.getIssues(this.currentPage, this.pageSize, query, this.selectedStatus)
            .subscribe({
                next: (res: any) => {
                    this.issues = res.issues;
                    this.totalIssues = res.total;
                    this.isLoading = false;
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    this.toast.error('Failed to load issues');
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            });
    }

    onPageChange(event: PageEvent) {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.loadIssues();
    }

    handleAction(event: { type: string, row: any }) {
        if (event.type === 'view') {
            const dialogRef = this.dialog.open(IssueViewDialogComponent, { width: '700px', data: { issue: event.row } });
            dialogRef.afterClosed().subscribe(updated => { if (updated) this.loadIssues(); });
        } else if (event.type === 'edit') {
            const dialogRef = this.dialog.open(IssueStatusDialogComponent, { width: '500px', data: { title: event.row.title, currentStatus: event.row.status } });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.adminService.updateIssueStatus(event.row._id, result.status, result.remarks).subscribe({
                        next: () => { this.toast.success('Status updated'); this.loadIssues(); },
                        error: () => this.toast.error('Update failed')
                    });
                }
            });
        } else if (event.type === 'delete') {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '400px', data: { title: 'Delete Issue', message: `Are you sure you want to delete "${event.row.title}"?` } });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.adminService.deleteIssue(event.row._id).subscribe({
                        next: () => { this.toast.success('Issue deleted'); this.loadIssues(); },
                        error: (err) => this.toast.error('Delete failed')
                    });
                }
            });
        }
    }

    handleBulkSelection(selected: any[]) { this.selectedIssues = selected; }
    openBulkUpdateModal() { this.toast.info(`Bulk updating ${this.selectedIssues.length} items`); }
}
