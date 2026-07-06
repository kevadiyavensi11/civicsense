
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TableViewComponent, ColumnDef } from '../../../shared/components/table-view/table-view.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserViewDialogComponent } from '../user-view/user-view.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatDialogModule,
        TableViewComponent
    ],
    template: `
    <div class="page-content fade-in">
        <div class="filters-bar card-3d">
            <mat-form-field appearance="outline" class="search-field">
                <mat-icon matPrefix>search</mat-icon>
                <input matInput placeholder="Search name or email..." [formControl]="searchControl">
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
                <mat-select [(ngModel)]="selectedRole" (selectionChange)="loadUsers()">
                    <mat-option value="all">All Roles</mat-option>
                    <mat-option value="citizen">Citizen</mat-option>
                    <mat-option value="authority">Authority</mat-option>
                    <mat-option value="admin">Admin</mat-option>
                </mat-select>
            </mat-form-field>

            <button mat-icon-button class="refresh-btn" (click)="loadUsers()" [disabled]="isLoading">
                <mat-icon [class.spin]="isLoading">refresh</mat-icon>
            </button>
            
            <button class="btn-3d" (click)="openAddUserModal()">
                <mat-icon style="margin-right: 8px">person_add</mat-icon> Add New User
            </button>
        </div>

        <app-table-view
            [data]="users"
            [columns]="columns"
            [isLoading]="isLoading"
            [total]="totalUsers"
            [pageSize]="pageSize"
            [title]="'Registered Users'"
            (pageChange)="onPageChange($event)"
            (action)="handleAction($event)">
        </app-table-view>
    </div>
  `,
    styles: [`
    .page-content { padding: 32px; display: flex; flex-direction: column; gap: 24px; max-width: 1400px; margin: 0 auto; }
    .card-3d { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-light); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .filters-bar { padding: 16px 24px; display: flex; gap: 16px; align-items: center; }
    .search-field { flex-grow: 1; margin-bottom: -1.25em; } 
    .filter-field { width: 200px; margin-bottom: -1.25em; }
    .refresh-btn { color: var(--secondary); }
    .btn-3d { 
        padding: 10px 20px; background: var(--secondary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
        box-shadow: 0 4px 0 #1e40af; transition: transform 0.1s; display: flex; align-items: center;
    }
    .btn-3d:active { transform: translateY(2px); box-shadow: 0 2px 0 #1e40af; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    ::ng-deep .mat-mdc-select-value-text { color: var(--text-primary) !important; font-weight: 600; }
    ::ng-deep .mat-mdc-form-field-infix { min-height: 48px !important; }
    ::ng-deep .mat-mdc-text-field-wrapper { background: var(--bg-surface-alt) !important; }
    ::ng-deep .mat-mdc-form-field-outline { color: var(--border-light) !important; }
    `]
})
export class UserListComponent implements OnInit {
    adminService = inject(AdminService);
    toast = inject(ToastService);
    dialog = inject(MatDialog);
    router = inject(Router);
    cdr = inject(ChangeDetectorRef);

    users: any[] = [];
    totalUsers = 0;
    pageSize = 10;
    currentPage = 1;
    searchControl = new FormControl('');
    selectedRole = 'all';
    isLoading = true;

    columns: ColumnDef[] = [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        {
            key: 'role', header: 'Role', type: 'badge', badgeColors: {
                'admin': 'purple-badge',
                'authority': 'blue-badge',
                'citizen': 'green-badge'
            }
        },
        { key: 'createdAt', header: 'Joined', type: 'date' }
    ];

    ngOnInit() {
        this.loadUsers();
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            this.currentPage = 1;
            this.loadUsers();
        });
    }

    loadUsers() {
        this.isLoading = true;
        const query = this.searchControl.value || '';
        this.adminService.getUsers(this.currentPage, this.pageSize, query, this.selectedRole)
            .subscribe({
                next: (res: any) => {
                    this.users = res.users;
                    this.totalUsers = res.total;
                    this.isLoading = false;
                    this.cdr.markForCheck();
                },
                error: (err: any) => {
                    this.toast.error('Failed to load users');
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            });
    }

    onPageChange(event: PageEvent) {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.loadUsers();
    }

    handleAction(event: { type: string, row: any }) {
        if (event.type === 'delete') {
            this.confirmDelete(event.row);
        } else if (event.type === 'edit') {
            this.openEditUserModal(event.row);
        } else if (event.type === 'view') {
            this.dialog.open(UserViewDialogComponent, { width: '600px', data: { user: event.row } });
        }
    }

    confirmDelete(user: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete User?',
                message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
                type: 'warn',
                confirmText: 'Delete'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.adminService.deleteUser(user._id).subscribe({
                    next: () => { this.toast.success('User deleted successfully'); this.loadUsers(); },
                    error: () => this.toast.error('Failed to delete user')
                });
            }
        });
    }

    openAddUserModal() {
        const dialogRef = this.dialog.open(UserFormComponent, { width: '500px', data: { user: null } });
        dialogRef.afterClosed().subscribe(result => { if (result) this.loadUsers(); });
    }

    openEditUserModal(user: any) {
        const dialogRef = this.dialog.open(UserFormComponent, { width: '500px', data: { user } });
        dialogRef.afterClosed().subscribe(result => { if (result) this.loadUsers(); });
    }
}
