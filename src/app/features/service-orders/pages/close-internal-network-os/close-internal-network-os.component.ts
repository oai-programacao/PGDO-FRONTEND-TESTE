import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { ServiceOrderService } from '../../services/service-order.service';
import { ViewServiceOrderDto } from '../../../../interfaces/service-order.model';
import {
  CloseInternalNetworkRequest,
  CloseInternalNetworkResponse,
} from '../../../../interfaces/internal-network.model';
import { SubTypeServiceOrder } from '../../../../interfaces/enums.model';

@Component({
  selector: 'app-close-internal-network-os',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './close-internal-network-os.component.html',
  styleUrl: './close-internal-network-os.component.scss',
})
export class CloseInternalNetworkOsComponent implements OnChanges, OnDestroy {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() serviceOrder: ViewServiceOrderDto | null = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<CloseInternalNetworkResponse>();

  SubTypeServiceOrder = SubTypeServiceOrder;
  closeForm!: FormGroup;
  isSubmitting = false;
  totalCalculado = 0;

  private destroy$ = new Subject<void>();

  osClassificationOptions = [
    { label: 'Suporte', value: 'SUPORTE' },
    { label: 'Instalação', value: 'INSTALACAO' },
    { label: 'Manutenção', value: 'MANUTENCAO' },
    { label: 'Outros', value: 'OUTROS' },
  ];

  constructor(
    private fb: FormBuilder,
    private serviceOrderService: ServiceOrderService,
    private messageService: MessageService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.initForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.totalCalculado = 0;
    this.closeForm = this.fb.group({
      conclusionDate: [null, Validators.required],
      osClassification: [null, Validators.required],
      billingDate: [null],
      cableMeters: [0],
      technicalHours: [0],
      rj45Connectors: [0],
      additionalDescription: [''],
      additionalValue: [0],
      observation: [''],
    });

    this.closeForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.recalcularTotal());
  }

  recalcularTotal(): void {
    if (!this.closeForm) return;
    const v = this.closeForm.value;
    const cabo = (v.cableMeters || 0) * 5.5;
    const horas = (v.technicalHours || 0) * 70;
    const conectores = (v.rj45Connectors || 0) * 4;
    const adicional = (v.additionalValue || 0);
    this.totalCalculado = cabo + horas + conectores + adicional;
  }

  confirmar(): void {
    if (!this.closeForm || this.closeForm.invalid || !this.serviceOrder) return;

    this.isSubmitting = true;
    const v = this.closeForm.value;

    const payload: CloseInternalNetworkRequest = {
      serviceOrderId: this.serviceOrder.id,
      contractNumber: this.serviceOrder.contractNumber!,
      conclusionDate: this.formatarData(v.conclusionDate)!,
      osClassification: v.osClassification,
      cableMeters: v.cableMeters || null,
      technicalHours: v.technicalHours || null,
      rj45Connectors: v.rj45Connectors || null,
      additionalDescription: v.additionalDescription || null,
      additionalValue: v.additionalValue || null,
      observation: v.observation || null,
      billingDate: this.formatarData(v.billingDate) || null,
    };

    this.serviceOrderService
      .closeInternalNetworkOrder(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => {
          this.visibleChange.emit(false);
          this.onSuccess.emit(response);
          this.fechar();
        },
        error: (err) => {
          const detail = err?.error?.message || 'Erro ao encerrar a OS.';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail });
        },
      });
  }

  fechar(): void {
    if (this.isSubmitting) return;
    this.totalCalculado = 0;
    if (this.closeForm) this.closeForm.reset();
    this.visibleChange.emit(false);
    this.onClose.emit();
  }
  private formatarData(data: string | null): string | null {
    if (!data) return null;
    const partes = data.split('/');
    if (partes.length !== 3) return data;
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
}