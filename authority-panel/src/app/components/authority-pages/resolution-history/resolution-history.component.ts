
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { IssueService } from '../../../services/issue.service';

@Component({
  selector: 'app-resolution-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  template: `
    <div class="page-container">
      <div class="header">
          <h1>Resolution History (Accountability Log)</h1>
      </div>

      <div class="table-container mat-elevation-z1">
        <table mat-table [dataSource]="dataSource" matSort>

          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Issue ID </th>
            <td mat-cell *matCellDef="let row"> #{{row.ticketNumber || row._id | slice:0:6}} </td>
          </ng-container>

          <!-- Resolution Date -->
          <ng-container matColumnDef="resolutionDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Resolution Date </th>
            <td mat-cell *matCellDef="let row"> {{ (row.updatedAt || row.createdAt) | date:'mediumDate' }} </td>
          </ng-container>

          <!-- Action Taken -->
          <ng-container matColumnDef="actionTaken">
            <th mat-header-cell *matHeaderCellDef> Action Taken </th>
            <td mat-cell *matCellDef="let row"> 
                {{ row.actionTaken || 'Resolved via Standard Protocol' }}
            </td>
          </ng-container>

          <!-- Remarks -->
          <ng-container matColumnDef="remarks">
            <th mat-header-cell *matHeaderCellDef> Remarks </th>
            <td mat-cell *matCellDef="let row"> {{ row.resolutionRemarks || row.description || 'No remarks logged.' }} </td>
          </ng-container>

          <!-- Time Taken -->
          <ng-container matColumnDef="timeTaken">
            <th mat-header-cell *matHeaderCellDef> Time Taken </th>
            <td mat-cell *matCellDef="let row"> 
                <span class="time-badge">{{ calculateTimeTaken(row) }}</span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
           
           <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="5">No resolution history found.</td>
          </tr>
        </table>

        <mat-paginator [pageSizeOptions]="[10, 25, 50]" aria-label="Select page"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .header h1 { color: #1e293b; font-size: 1.5rem; margin-bottom: 24px; }
    
    .table-container { background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
    
    th.mat-header-cell {
        background: #f1f5f9;
        color: #475569;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.75rem;
    }
    
    td.mat-cell { color: #334155; padding: 16px; font-size: 0.9rem; }

    .time-badge {
        background: #f1f5f9; color: #475569;
        padding: 4px 8px; border-radius: 4px;
        font-weight: 600; font-size: 0.8rem;
    }

    :host-context(body.dark-theme) th.mat-header-cell { background: #1e293b; color: #94a3b8; }
    :host-context(body.dark-theme) .table-container { background: #0f172a; border-color: #334155; }
    :host-context(body.dark-theme) td.mat-cell { color: #cbd5e1; }
    :host-context(body.dark-theme) .time-badge { background: #334155; color: #cbd5e1; }
  `]
})
export class ResolutionHistoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'resolutionDate', 'actionTaken', 'remarks', 'timeTaken'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  issueService = inject(IssueService);

  constructor() { this.dataSource = new MatTableDataSource<any>([]); }

  ngOnInit() {
    this.issueService.getIssues().subscribe((data: any) => {
      const issues = Array.isArray(data) ? data : (data.issues || []);
      // Filter for Resolved
      const resolved = issues.filter((i: any) => i.status === 'Resolved' || i.status === 'Closed');
      this.dataSource.data = resolved;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  calculateTimeTaken(issue: any): string {
    // Placeholder logic
    return '2 Days';
  }
}
