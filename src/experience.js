class Experience {
  constructor() {
    this.experienceWindow = document.getElementById("experience");
    this.maximizeBtn = document.getElementById("maximize-experience");
    this.isMaximized = false;
  }

  activateEvents() {
    // Menambahkan event listener hanya jika tombol maximize ditemukan
    if (this.maximizeBtn) {
      this.maximizeBtn.addEventListener("click", () => this.toggleMaximize());
    }
  }

  deactivateEvents() {
    // Menghapus event listener dengan cara clone node (cara cepat membersihkan listener)
    if (this.maximizeBtn) {
      const newBtn = this.maximizeBtn.cloneNode(true);
      this.maximizeBtn.parentNode.replaceChild(newBtn, this.maximizeBtn);
      this.maximizeBtn = newBtn;
    }
  }

  toggleMaximize() {
    if (!this.experienceWindow) return;

    if (!this.isMaximized) {
      // Masuk ke Mode Maximize (Layar Penuh dalam window)
      this.experienceWindow.classList.add("window-maximized");
      this.isMaximized = true;
      
      // Opsional: Ubah style tombol jika CSS mendukung visual 'restore down'
      // this.maximizeBtn.classList.add("toggled"); 
    } else {
      // Kembali ke Ukuran Normal
      this.experienceWindow.classList.remove("window-maximized");
      this.isMaximized = false;
      
      // Opsional: Balikkan style tombol
      // this.maximizeBtn.classList.remove("toggled");
    }
  }
}

export default Experience;