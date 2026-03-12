import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { SellerService } from '../service/seller.service';

@Component({
  selector: 'app-register-seller',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, InputMaskModule,
    InputNumberModule, PasswordModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register-seller.component.html',
  styleUrls: ['./register-seller.component.scss']
})
export class RegisterSellerComponent implements OnInit {

  form!: FormGroup;
  isSubmitting = false;
  photoPreview: string | null = null;
  photoFile: File | null = null;

  get f() { return this.form.controls; }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private sellerService: SellerService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name:     ['', Validators.required],
      cpf:      ['', Validators.required],
      age:      [null],
      phone:    ['', Validators.required],
      phone2:   [''],
      city:     ['', Validators.required],
      goal:     [null],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userRbx:  ['', Validators.required],
    });
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.messageService.add({ summary: 'Atenção', detail: 'Foto deve ter no máximo 5MB', severity: 'warn' });
      return;
    }

    this.photoFile = file;
    const reader = new FileReader();
    reader.onload = (e) => this.photoPreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoPreview = null;
    this.photoFile = null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(this.form.value)], { type: 'application/json' }));
    if (this.photoFile) formData.append('foto', this.photoFile);

    this.sellerService.createSeller(formData).subscribe({
      next: () => {
        this.messageService.add({ summary: 'Sucesso', detail: 'Vendedor cadastrado com sucesso!', severity: 'success' });
        setTimeout(() => this.router.navigate(['/app/vendedores']), 3500);
      },
      error: (err) => {
        this.messageService.add({ summary: 'Erro', detail: err?.error?.message || 'Erro ao cadastrar vendedor', severity: 'error' });
        this.isSubmitting = false;
      }
    });
  }

  goBack() { this.router.navigate(['/app/vendedores']); }
}