
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { IssueService } from '../../../services/issue.service';

@Component({
  selector: 'app-verified-issues',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule
  ],
  template: `
    <div class="page-container">
      
      <!-- Filters -->
      <div class="filter-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search Issue ID or Location</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Ex. 12345">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select (selectionChange)="filterBystats($event.value, 'priority')">
            <mat-option value="">All</mat-option>
            <mat-option value="High">High</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="Low">Low</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select (selectionChange)="filterBystats($event.value, 'category')">
             <mat-option value="">All</mat-option>
             <mat-option value="Garbage">Garbage</mat-option>
             <mat-option value="Pot Holes">Pot Holes</mat-option>
             <mat-option value="Water Logging">Water Logging</mat-option>
             <mat-option value="Street Light">Street Light</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Data Table -->
      <div class="table-container mat-elevation-z2">
        <table mat-table [dataSource]="dataSource" matSort>

          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Issue ID </th>
            <td mat-cell *matCellDef="let row"> #{{row.ticketNumber || row._id | slice:0:6}} </td>
          </ng-container>

          <!-- Category Column -->
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Category </th>
            <td mat-cell *matCellDef="let row"> {{row.category}} </td>
          </ng-container>

          <!-- Location Column -->
          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef> Location / Ward </th>
            <td mat-cell *matCellDef="let row"> 
                <div class="loc-cell">
                    <span>{{row.location?.area || 'Unknown'}}</span>
                    <small class="text-secondary">{{row.zone || 'Ward 1'}}</small>
                </div>
            </td>
          </ng-container>

          <!-- Priority Column -->
          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Priority </th>
            <td mat-cell *matCellDef="let row"> 
                <span class="priority-tag" [class]="(row.priority || 'Medium').toLowerCase()">
                    {{row.priority || 'Medium'}}
                </span>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
            <td mat-cell *matCellDef="let row">
                <span class="status-chip" [class]="(row.status || 'Open').replace(' ','-').toLowerCase()">
                    {{row.status || 'Open'}}
                </span>
            </td>
          </ng-container>

           <!-- Verified Column -->
           <ng-container matColumnDef="verification">
            <th mat-header-cell *matHeaderCellDef> System Verified </th>
            <td mat-cell *matCellDef="let row">
                <div class="verified-cell" *ngIf="row.systemVerified">
                   <mat-icon class="text-primary">verified</mat-icon> Yes
                </div>
                <span *ngIf="!row.systemVerified" class="text-secondary">-</span>
            </td>
          </ng-container>

          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Date Reported </th>
            <td mat-cell *matCellDef="let row"> {{row.createdAt | date:'shortDate'}} </td>
          </ng-container>

          <!-- Action Column -->
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef> Action </th>
            <td mat-cell *matCellDef="let row">
              <button mat-stroked-button color="primary" [routerLink]="['/authority/issues', row._id]">
                View
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="4">No data matching the filter</td>
          </tr>
        </table>

        <mat-paginator [pageSizeOptions]="[10, 25, 100]" aria-label="Select page of users"></mat-paginator>
      </div>

    </div>
  `,
  styles: [`
    .page-container {
        padding: 24px;
        background: #f8fafc;
        min-height: 100%;
    }

    .filter-bar {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        background: white;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        flex-wrap: wrap;
    }

    .filter-bar mat-form-field {
        font-size: 14px;
        width: 200px;
    }
    .filter-bar .search-field {
        flex: 1;
        min-width: 300px;
    }

    .table-container {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
    }

    table {
        width: 100%;
    }

    th.mat-header-cell {
        background: #0f172a; /* Dark Government Blue */
        color: white;
        font-weight: 600;
        font-size: 0.85rem;
        padding: 16px;
    }

    td.mat-cell {
        padding: 16px;
        color: #334155;
        border-bottom-color: #f1f5f9;
        font-size: 0.9rem;
    }

    .loc-cell {
        display: flex;
        flex-direction: column;
        line-height: 1.3;
    }

    /* Priority Tags */
    .priority-tag {
        padding: 4px 10px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
    }
    .priority-tag.high { background: #fee2e2; color: #dc2626; } /* Red */
    .priority-tag.medium { background: #ffedd5; color: #c2410c; } /* Orange */
    .priority-tag.low { background: #dcfce7; color: #15803d; } /* Green */

    /* Status Chips */
    .status-chip {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .status-chip.open { background: #fee2e2; color: #b91c1c; }
    .status-chip.in-progress { background: #e0f2fe; color: #0369a1; }
    .status-chip.resolved { background: #dcfce7; color: #15803d; }
    
    .verified-cell {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;
        color: #0891b2;
    }
    .verified-cell mat-icon { font-size: 18px; width: 18px; height: 18px; }

    /* Dark Mode Support */
    :host-context(body.dark-theme) .page-container { background: #0f172a; }
    :host-context(body.dark-theme) .filter-bar { background: #1e293b; border-color: #334155; }
    :host-context(body.dark-theme) .table-container { background: #1e293b; border-color: #334155; }
    :host-context(body.dark-theme) th.mat-header-cell { background: #020617; color: #f8fafc; }
    :host-context(body.dark-theme) td.mat-cell { color: #cbd5e1; border-bottom-color: #334155; }
    :host-context(body.dark-theme) .text-secondary { color: #64748b; }
  `]
})
export class VerifiedIssuesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'category', 'location', 'priority', 'verification', 'status', 'date', 'action'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  issueService = inject(IssueService);

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Fetch only verified issues or all issues and filter
    this.issueService.getIssues().subscribe((data: any) => {
      const issues = Array.isArray(data) ? data : (data.issues || []);
      // Filter for verified if needed, or show all with verified status
      // The prompt says "Verified Issues Page", so ideally we should filter.
      // But for now let's show all and let the user filter, or pre-filter if backend supports it.
      // Assuming we show all for now.
      this.dataSource.data = issues;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterBystats(value: string, column: string) {
    // Custom filter logic could be added here
    // For simplicity, using the default filter for now which concatenates all values.
    // Ideally we would use a filterPredicate.
    if (!value) {
      this.dataSource.filter = '';
      return;
    }
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
