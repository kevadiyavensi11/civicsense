
import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/services/toast.service';
import { AdminService } from '../../../services/admin.service';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule, MatDialogModule,
        MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule
    ],
    template: `
    <div class="custom-modal">
        <div class="m-header">
            <h2 class="m-title"><mat-icon class="title-icon">person_add</mat-icon> {{data.user ? 'Edit User Credentials' : 'Add User Credentials'}}</h2>
            <button class="m-close" type="button" (click)="dialogRef.close()"><mat-icon>close</mat-icon></button>
        </div>
        
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="m-form">
            
            <div class="f-group full-width">
                <label>FULL NAME</label>
                <div class="f-input-wrapper" [class.error]="userForm.get('name')?.invalid && userForm.get('name')?.touched">
                    <mat-icon class="f-icon">person_outline</mat-icon>
                    <input type="text" formControlName="name" placeholder="Enter full name">
                </div>
            </div>

            <div class="f-group full-width">
                <label>EMAIL ADDRESS</label>
                <div class="f-input-wrapper" [class.error]="userForm.get('email')?.invalid && userForm.get('email')?.touched">
                    <mat-icon class="f-icon">mail_outline</mat-icon>
                    <input type="email" formControlName="email" placeholder="person@domain.com">
                </div>
            </div>

            <div class="f-group full-width" *ngIf="!data.user">
                <label>TEMPORARY PASSWORD</label>
                <div class="f-input-wrapper" [class.error]="userForm.get('password')?.invalid && userForm.get('password')?.touched">
                    <mat-icon class="f-icon">lock_outline</mat-icon>
                    <input type="password" formControlName="password" placeholder="Create password">
                </div>
            </div>

            <div class="f-row">
                <div class="f-group half-width">
                    <label>SYSTEM ROLE</label>
                    <div class="f-input-wrapper">
                        <mat-icon class="f-icon">shield</mat-icon>
                        <select formControlName="role">
                            <option value="citizen">Citizen</option>
                            <option value="authority">Authority</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div class="f-group half-width" *ngIf="userForm.get('role')?.value === 'authority'">
                    <label>ASSIGNED JURISDICTION</label>
                    <div class="f-input-wrapper">
                        <mat-icon class="f-icon">map</mat-icon>
                        <select formControlName="area">
                            <option value="Central Zone">Central Zone</option>
                            <option value="North Zone">North Zone</option>
                            <option value="West Zone">West Zone</option>
                            <option value="South West Zone">South West Zone</option>
                            <option value="South Zone">South Zone</option>
                            <option value="East Zone">East Zone</option>
                            <option value="Varachha Zone">Varachha Zone</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="m-actions">
                <button type="button" class="btn-flat" (click)="dialogRef.close()">CANCEL</button>
                <button type="submit" class="btn-primary" [disabled]="userForm.invalid || isLoading">
                    <mat-icon class="btn-icon">save</mat-icon>
                    {{data.user ? 'UPDATE USER' : 'CREATE USER'}}
                </button>
            </div>
        </form>
    </div>
  `,
    styles: [`
    * { box-sizing: border-box; }
    :host { display: block; border-radius: 20px; overflow: hidden; background: transparent; width: 100%; }
    .custom-modal { display: flex; flex-direction: column; background: white; padding: 24px; width: 100%; }
    
    .m-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .m-title { display: flex; align-items: center; gap: 12px; margin: 0; font-size: 1.15rem; font-weight: 800; color: #0F172A; font-family: 'Poppins', sans-serif; letter-spacing: -0.5px; }
    .title-icon { color: #10B981; font-size: 24px; width: 24px; height: 24px; }
    
    .m-close { background: white; border: 1px solid #E2E8F0; border-radius: 10px; color: #64748B; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); flex-shrink: 0; }
    .m-close:hover { background: #F8FAFC; color: #0F172A; }
    
    .m-form { display: flex; flex-direction: column; gap: 20px; width: 100%; }
    .f-row { display: flex; gap: 16px; width: 100%; }
    .f-group { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .half-width { flex: 1; min-width: 0; }
    
    label { font-size: 0.65rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; }
    
    .f-input-wrapper { display: flex; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 0 14px; height: 46px; transition: 0.3s; width: 100%; }
    .f-input-wrapper:focus-within { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); background: white; }
    .f-input-wrapper.error { border-color: #EF4444; }
    
    .f-icon { color: #94A3B8; font-size: 20px; width: 20px; height: 20px; margin-right: 10px; flex-shrink: 0; transition: 0.3s; }
    .f-input-wrapper:focus-within .f-icon { color: #3B82F6; }
    
    input, select { flex: 1; min-width: 0; border: none; background: transparent; outline: none; font-family: inherit; font-size: 0.85rem; font-weight: 500; color: #0F172A; width: 100%; height: 100%; padding: 0; appearance: none; }
    select { cursor: pointer; }
    
    .m-actions { display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-top: 12px; width: 100%; }
    
    .btn-flat { 
        background: transparent; border: none; color: #64748B; font-weight: 700; font-size: 0.75rem; 
        letter-spacing: 0.5px; padding: 10px 16px; cursor: pointer; transition: 0.2s; border-radius: 8px;
    }
    .btn-flat:hover { color: #0F172A; background: #F1F5F9; }
    
    .btn-primary { 
        display: flex; align-items: center; justify-content: center; gap: 8px; background: #0F172A; color: white; border: none; 
        border-radius: 12px; padding: 0 20px; height: 44px; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.5px;
        cursor: pointer; box-shadow: 0 4px 10px rgba(15, 23, 42, 0.2); transition: 0.2s; white-space: nowrap;
    }
    .btn-primary:active { transform: translateY(2px); box-shadow: 0 2px 5px rgba(15, 23, 42, 0.2); }
    .btn-primary:disabled { background: #94A3B8; box-shadow: none; cursor: not-allowed; opacity: 0.7; }
    .btn-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class UserFormComponent {
    fb = inject(FormBuilder);
    http = inject(HttpClient);
    adminService = inject(AdminService);
    toast = inject(ToastService);
    isLoading = false;

    userForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        role: ['citizen', Validators.required],
        area: ['']
    });

    constructor(
        public dialogRef: MatDialogRef<UserFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user?: any }
    ) {
        if (data.user) {
            this.userForm.patchValue(data.user);
            // Password is not required when editing
            this.userForm.get('password')?.clearValidators();
            this.userForm.get('password')?.updateValueAndValidity();
        } else {
            // Password required for new users
            this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        }
    }

    onSubmit() {
        if (this.userForm.invalid) return;

        this.isLoading = true;
        const formVal = this.userForm.value;

        if (this.data.user) {
            // Update using Generic User Update Endpoint (via AdminService)
            this.adminService.updateUser(this.data.user._id, {
                name: formVal.name,
                email: formVal.email,
                role: formVal.role,
                area: formVal.area || ''
            }).subscribe({
                next: () => {
                    this.toast.success('User updated successfully');
                    this.dialogRef.close(true);
                },
                error: (err: any) => {
                    this.toast.error(err.error?.message || 'Update failed');
                    this.isLoading = false;
                }
            });
        } else {
            // Create (Using Register API or Admin Create User API)
            // Assuming we use the public register API for simplicity, OR a dedicated admin create endpoint
            this.http.post(`${environment.apiUrl}/users`, formVal).subscribe({
                next: () => {
                    this.toast.success('User created successfully');
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.toast.error(err.error?.message || 'Creation failed');
                    this.isLoading = false;
                }
            });
        }
    }
}
