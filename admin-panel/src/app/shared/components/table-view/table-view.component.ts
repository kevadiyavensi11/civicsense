
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

export interface ColumnDef {
    key: string;
    header: string;
    type?: 'text' | 'date' | 'badge' | 'image' | 'action';
    badgeColors?: { [key: string]: string }; // Map value to color class
}

@Component({
    selector: 'app-table-view',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatCheckboxModule, MatPaginatorModule],
    template: `
        <div class="glass-table-container card-3d">
            <div class="table-header" *ngIf="title || actions.length">
                <h3>{{title}}</h3>
                <div class="header-actions">
                    <ng-content select="[header-actions]"></ng-content>
                    
                    <button mat-button class="btn-3d-danger" *ngIf="selection.hasValue()" (click)="emitBulkAction()">
                        <mat-icon>delete</mat-icon> Delete Selected ({{selection.selected.length}})
                    </button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="clean-table">
                    <thead>
                        <tr>
                            <th class="checkbox-col">
                                <mat-checkbox 
                                    (change)="$event ? toggleAllRows() : null"
                                    [checked]="selection.hasValue() && isAllSelected()"
                                    [indeterminate]="selection.hasValue() && !isAllSelected()">
                                </mat-checkbox>
                            </th>
                            <th *ngFor="let col of columns" (click)="sort(col.key)" [class.sortable]="true">
                                {{col.header}}
                                <mat-icon *ngIf="activeSort === col.key" class="sort-icon">
                                    {{sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}}
                                </mat-icon>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- SKELETON LOADER -->
                        <ng-container *ngIf="isLoading">
                             <tr *ngFor="let i of [1,2,3,4,5]" class="skeleton-row">
                                 <td class="checkbox-col">
                                     <div class="skeleton-box" style="width: 18px; height: 18px"></div>
                                 </td>
                                 <td *ngFor="let col of columns">
                                     <div class="skeleton-box" [style.width]="'80%'"></div>
                                 </td>
                                 <td class="actions-cell">
                                     <div class="skeleton-circle" style="width: 24px; height: 24px"></div>
                                 </td>
                             </tr>
                        </ng-container>

                        <!-- DATA ROWS -->
                        <ng-container *ngIf="!isLoading">
                            <tr *ngFor="let row of data" [class.selected]="selection.isSelected(row)">
                                <td class="checkbox-col">
                                    <mat-checkbox 
                                        (click)="$event.stopPropagation()"
                                        (change)="$event ? selection.toggle(row) : null"
                                        [checked]="selection.isSelected(row)">
                                    </mat-checkbox>
                                </td>
                                <td *ngFor="let col of columns">
                                    <ng-container [ngSwitch]="col.type">
                                        
                                        <span *ngSwitchCase="'date'" class="mono-text">{{ resolveKey(row, col.key) | date:'mediumDate' }}</span>
                                        
                                        <div *ngSwitchCase="'image'" class="cell-image">
                                            <img [src]="resolveKey(row, col.key) || 'assets/placeholder.png'" alt="img">
                                        </div>
                                        
                                        <span *ngSwitchCase="'badge'" class="status-badge" [ngClass]="getBadgeClass(resolveKey(row, col.key), col)">
                                            {{ resolveKey(row, col.key) }}
                                        </span>
    
                                        <span *ngSwitchDefault>{{ resolveKey(row, col.key) }}</span>
                                    </ng-container>
                                </td>
                                <td class="actions-cell">
                                    <button mat-icon-button [matMenuTriggerFor]="menu">
                                        <mat-icon>more_vert</mat-icon>
                                    </button>
                                    <mat-menu #menu="matMenu">
                                        <button mat-menu-item (click)="action.emit({type: 'edit', row: row})">
                                            <mat-icon>edit</mat-icon> Edit
                                        </button>
                                        <button mat-menu-item (click)="action.emit({type: 'view', row: row})">
                                            <mat-icon>visibility</mat-icon> View Details
                                        </button>
                                        <button mat-menu-item class="text-danger" (click)="action.emit({type: 'delete', row: row})">
                                            <mat-icon color="warn">delete</mat-icon> Delete
                                        </button>
                                        <!-- Custom Actions -->
                                        <ng-container *ngFor="let act of customActions">
                                            <button mat-menu-item (click)="action.emit({type: act.key, row: row})">
                                                <mat-icon>{{act.icon}}</mat-icon> {{act.label}}
                                            </button>
                                        </ng-container>
                                    </mat-menu>
                                </td>
                            </tr>
                        </ng-container>

                        <!-- EMPTY STATE -->
                        <tr *ngIf="!isLoading && data.length === 0">
                            <td [attr.colspan]="columns.length + 2" class="empty-state">
                                <mat-icon>inbox</mat-icon>
                                <p>No records found</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <mat-paginator 
                [length]="total"
                [pageSize]="pageSize"
                [pageSizeOptions]="[5, 10, 25, 100]"
                (page)="onPageChange($event)"
                class="clean-paginator">
            </mat-paginator>
        </div>
    `,
    styles: [`
        :host { display: block; }
        .glass-table-container { padding: 0; overflow: hidden; background: var(--bg-card); transition: background 0.3s ease; }
        .table-header { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); }
        .table-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
        
        .clean-table { width: 100%; border-collapse: collapse; }
        .clean-table th { 
            text-align: left; padding: 16px; 
            color: var(--text-primary); 
            font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700;
            border-bottom: 1px solid var(--border-light);
            cursor: pointer; user-select: none;
            background: var(--bg-surface-alt);
        }
        .clean-table th:hover { color: var(--secondary); }
        .checkbox-col { width: 40px; padding-left: 24px; }
        
        .clean-table td { padding: 16px; color: var(--text-primary); border-bottom: 1px solid var(--border-light); transition: 0.2s; }
        .clean-table tr:last-child td { border-bottom: none; }
        .clean-table tr:hover td { background: var(--bg-surface-alt); }
        .clean-table tr.selected td { background: rgba(37, 99, 235, 0.1); }

        /* MATERIAL OVERRIDES FOR VISIBILITY */
        ::ng-deep .mat-mdc-checkbox-outline-path { stroke: var(--text-muted) !important; }
        ::ng-deep .mat-mdc-checkbox.mat-primary { --mdc-checkbox-selected-icon-color: var(--secondary); }
        ::ng-deep .mat-mdc-checkbox .mdc-checkbox__background { border-color: var(--text-muted) !important; }
        ::ng-deep .dark-theme .mat-mdc-checkbox .mdc-checkbox__background { border-color: rgba(255,255,255,0.3) !important; }
        ::ng-deep .mat-mdc-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background { background-color: var(--secondary) !important; border-color: var(--secondary) !important; }

        .cell-image img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-light); }
        .mono-text { font-family: 'Courier New', monospace; font-size: 0.9em; color: var(--text-secondary); }

        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .empty-state { text-align: center; padding: 60px 0; color: var(--text-tertiary); background: transparent; }
        .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.3; }
        
        .sort-icon { font-size: 16px; width: 16px; height: 16px; vertical-align: middle; margin-left: 4px; }
        
        /* Paginator Overrides */
        ::ng-deep .clean-paginator { background: transparent !important; color: var(--text-secondary) !important; border-top: 1px solid var(--border-light); }
        ::ng-deep .mat-mdc-paginator-container { justify-content: flex-end; }
        ::ng-deep .mat-mdc-paginator-page-size-label, ::ng-deep .mat-mdc-paginator-range-label { color: var(--text-secondary) !important; }
        ::ng-deep .mat-mdc-icon-button[disabled] { color: var(--text-muted) !important; opacity: 0.4; }
        ::ng-deep .mat-mdc-select-value { color: var(--text-secondary) !important; }
    `]
})
export class TableViewComponent implements OnInit {
    @Input() isLoading = false;
    @Input() data: any[] = [];
    @Input() columns: ColumnDef[] = [];
    @Input() total = 0;
    @Input() pageSize = 10;
    @Input() title = '';
    @Input() customActions: any[] = [];
    @Input() actions: string[] = ['view', 'edit', 'delete'];

    @Output() pageChange = new EventEmitter<PageEvent>();
    @Output() sortChange = new EventEmitter<{ key: string, dir: string }>();
    @Output() action = new EventEmitter<{ type: string, row: any }>();
    @Output() bulkAction = new EventEmitter<any[]>();

    selection = new SelectionModel<any>(true, []);
    activeSort = '';
    sortDirection: 'asc' | 'desc' = 'desc';

    ngOnInit() { }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.data.length;
        return numSelected === numRows;
    }

    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.data);
    }

    onPageChange(event: PageEvent) {
        this.pageChange.emit(event);
    }

    sort(key: string) {
        if (this.activeSort === key) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.activeSort = key;
            this.sortDirection = 'asc';
        }
        this.sortChange.emit({ key: this.activeSort, dir: this.sortDirection });
    }

    emitBulkAction() {
        this.bulkAction.emit(this.selection.selected);
    }

    getBadgeClass(value: string, col: ColumnDef): string {
        const val = value || '';
        if (!col.badgeColors) return 'badge-default';
        const normalized = val.toLowerCase();
        return col.badgeColors[normalized] || col.badgeColors['default'] || 'badge-default';
    }

    resolveKey(obj: any, path: string): any {
        return path.split('.').reduce((o, p) => (o ? o[p] : ''), obj);
    }
}
