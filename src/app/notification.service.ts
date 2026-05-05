import { Injectable } from '@angular/core';

declare var Swal: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /**
   * Success Dialog (Zero Radius, High Contrast)
   */
  success(title: string, text: string = '') {
    return Swal.fire({
      title: title.toUpperCase(),
      text,
      icon: 'success',
      confirmButtonText: 'ACKNOWLEDGE',
      customClass: {
        popup: 'arch-popup',
        confirmButton: 'arch-btn-confirm',
        title: 'arch-title'
      },
      buttonsStyling: false,
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      iconColor: '#3B82F6',
      showClass: {
        popup: 'animate__animated animate__fadeIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut'
      }
    });
  }

  /**
   * Error Dialog
   */
  error(title: string, text: string = '') {
    return Swal.fire({
      title: title.toUpperCase(),
      text,
      icon: 'error',
      confirmButtonText: 'RECALIBRATE',
      customClass: {
        popup: 'arch-popup',
        confirmButton: 'arch-btn-error'
      },
      buttonsStyling: false,
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      iconColor: '#ef4444'
    });
  }

  /**
   * Technical Prompt
   */
  confirm(title: string, text: string = '') {
    return Swal.fire({
      title: title.toUpperCase(),
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'EXECUTE',
      cancelButtonText: 'ABORT',
      customClass: {
        popup: 'arch-popup',
        confirmButton: 'arch-btn-confirm',
        cancelButton: 'arch-btn-cancel'
      },
      buttonsStyling: false,
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    });
  }
}
