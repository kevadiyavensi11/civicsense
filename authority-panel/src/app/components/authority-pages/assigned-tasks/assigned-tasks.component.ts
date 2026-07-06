
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { IssueService } from '../../../services/issue.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-assigned-tasks',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, RouterModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Assigned Tasks</h1>
      
      <div class="table-container mat-elevation-z2">
        <table mat-table [dataSource]="dataSource" matSort>
          
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Issue ID </th>
            <td mat-cell *matCellDef="let row"> #{{row.ticketNumber || row._id | slice:0:6}} </td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef> Issue Title </th>
            <td mat-cell *matCellDef="let row"> {{row.title}} </td>
          </ng-container>

          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef> Priority </th>
            <td mat-cell *matCellDef="let row"> 
                <span class="priority-tag" [class]="(row.priority || 'medium').toLowerCase()">{{row.priority || 'Medium'}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let row"> 
                 <span class="status-chip" [class]="(row.status || 'open').toLowerCase().replace(' ', '-')">{{row.status}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef> Action </th>
            <td mat-cell *matCellDef="let row">
              <button mat-stroked-button color="primary" [routerLink]="['/authority/issues', row._id]">Work on Task</button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
           <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="5">No pending tasks assigned to you.</td>
          </tr>
        </table>
        <mat-paginator [pageSizeOptions]="[10, 20]" aria-label="Select page"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; background: #f8fafc; min-height: 100vh; }
    .page-title { color: #0f172a; margin-bottom: 24px; font-weight: 700; }
    .table-container { background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    th.mat-header-cell { background: #0f172a; color: white; padding: 16px; }
    td.mat-cell { padding: 16px; color: #334155; border-bottom-color: #f1f5f9; }
    
    .priority-tag { padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; }
    .priority-tag.high { background: #fee2e2; color: #dc2626; }
    .priority-tag.medium { background: #ffedd5; color: #c2410c; }
    .priority-tag.low { background: #dcfce7; color: #15803d; }

    .status-chip { padding: 4px 10px; border-radius: 12px; background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 600; }
    .status-chip.in-progress { background: #e0f2fe; color: #0369a1; }
  `]
})
export class AssignedTasksComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'priority', 'status', 'action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  issueService = inject(IssueService);
  authService = inject(AuthService);

  constructor() { this.dataSource = new MatTableDataSource<any>([]); }

  ngOnInit() {
    const myId = this.authService.getCurrentUserId();
    this.issueService.getIssues().subscribe((data: any) => {
      const issues = Array.isArray(data) ? data : (data.issues || []);
      const myTasks = issues.filter((i: any) => i.assignedAuthorityId === myId && i.status !== 'Resolved');
      this.dataSource.data = myTasks;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
