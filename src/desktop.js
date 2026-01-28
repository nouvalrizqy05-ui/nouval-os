import DragSelect from "dragselect";
import Resume from "../static/resume/Joan_Ramos_Refusta_CV_2024.pdf";
import Experience from "./experience";
import AboutMe from "./about-me";
import Credits from "./credits";
import Contact from "./contact";

// Inisialisasi global
const experience = new Experience();
const aboutMe = new AboutMe();
const credits = new Credits();
const contact = new Contact();

class Desktop {
  constructor() {
    this.maxZIndex = 10;
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.ds = new DragSelect({
      selectables: document.querySelectorAll(".apps"),
      callback: (e) => console.log(e),
    });
    this.windowsMenu = document.querySelector(".open-windows-menu");
    this.footer = document.getElementById("footer");
    this.windowsIcon = document.getElementById("windows-icon-section");
    this.titleBar = document.querySelectorAll(".title-bar");
    this.bottomApps = document.querySelectorAll(".taskbar-app");
    this.currentDate = document.getElementById("current-date");
    this.hoursMinutes = document.getElementById("hours-minutes");
    this.apps = document.querySelectorAll(".apps");
    this.minimizeButtons = document.querySelectorAll(".minimize");
    this.closeButtons = document.querySelectorAll(".close");
    this.restoreButtons = document.querySelectorAll(".restore");
  }

  activateEvents() {
    // Aktifkan event dari class external
    experience.activateEvents();
    aboutMe.activateEvents();
    credits.activateEvents();
    contact.activateEvents();

    this.activateFooterEvent();
    this.activateOutsideWindowsIconEvent();
    this.activateWindowsIconEvent();
    this.activateTitleBarEvents();
    this.activateDateTimeUpdates();
    this.activateAppEvents();

    this.activateBottomAppEvents();
    this.activateMinimizeButtons();
    this.activateCloseButtons();
    this.activateRestoreButtons();
    this.activateMouseUpEvent();

    setInterval(this.activateDateTimeUpdates, 1000);
    this.activateDateTimeUpdates();
  }

  activateMouseUpEvent = () => {
    document.addEventListener("mouseup", () => {
      window.parent.postMessage("mouseup", "*");
      if (this.ds.stopped) {
        this.ds.start();
      }
    });
    document.addEventListener("mousedown", () => {
      window.parent.postMessage("mousedown", "*");
    });
  };

  activateFooterEvent = () => {
    this.footer.addEventListener("mousedown", () => {
      if (!this.ds.stopped) {
        this.ds.stop();
      }
    });
  };

  activateWindowsIconEvent = () => {
    this.windowsIcon.addEventListener("click", () => {
      this.openMenu();
    });
  };

  openMenu = () => {
    if (this.windowsMenu.getAttribute("style") == null) {
      this.windowsMenu.setAttribute(
        "style",
        "display: flex; transition: all 0.2s ease-in"
      );
    } else {
      this.windowsMenu.removeAttribute("style");
    }
  };

  activateOutsideWindowsIconEvent = () => {
    document.addEventListener("mousedown", (event) => {
      if (!event.target.closest(".open-windows-menu")) {
        this.windowsMenu.removeAttribute("style");
      }
    });
  };

  startDrag = (event) => {
    if (!this.ds?.stopped) {
      this.ds.stop();
    }
    this.element = event.srcElement.parentElement;
    
    // Jangan drag jika window sedang maximized (penuh layar)
    if (this.element.classList.contains("window-maximized")) return;

    this.incrementMaxZIndex(this.element);
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;
    this.initialWindowX = parseFloat(
      window.getComputedStyle(this.element).left
    );
    this.initialWindowY = parseFloat(window.getComputedStyle(this.element).top);

    document.addEventListener("mousemove", this.drag);
    document.addEventListener("mouseup", this.stopDrag);
  };

  incrementMaxZIndex = (element) => {
    if (!element.id) {
      return;
    }
    this.bottomApps.forEach((bottomApp) => {
      if (bottomApp.classList.contains("taskbar-selected")) {
        bottomApp.classList.remove("taskbar-selected");
      }
    });
    const currentBottomApp = document.getElementById(element.id + "_bottom");
    if (currentBottomApp) {
        currentBottomApp.classList.add("taskbar-selected");
    }
    element.style.zIndex = this.maxZIndex + 1;
    ++this.maxZIndex;
  };

  drag = (event) => {
    if (this.element.style.width == "100vw") {
      return;
    }
    let mouseY = event.clientY;
    if (event.clientY < 0) {
      mouseY = 0;
    } else if (event.clientY > window.innerHeight - 50) {
      mouseY = window.innerHeight - 50;
    }
    let mouseX = event.clientX;
    if (event.clientX < 0) {
      mouseX = 0;
    } else if (event.clientX > window.innerWidth) {
      mouseX = window.innerWidth;
    }
    const deltaX = mouseX - this.initialMouseX;
    const deltaY = mouseY - this.initialMouseY;
    this.element.style.left = this.initialWindowX + deltaX + "px";
    this.element.style.top = this.initialWindowY + deltaY + "px";
  };

  stopDrag = () => {
    if (this.ds.stopped) {
      this.ds.start();
    }
    document.removeEventListener("mousemove", this.drag);
    document.removeEventListener("mouseup", this.stopDrag);
  };

  activateTitleBarEvents = () => {
    this.titleBar.forEach((title_bar) => {
      title_bar.addEventListener("mousedown", this.startDrag);
      // Double click title bar behavior
      title_bar.addEventListener("dblclick", () => {
        const parentWindow = title_bar.parentElement;
        // Jika window experience, gunakan logika toggle dari class Experience (via click button maximize)
        if (parentWindow.id === 'experience') {
            const maxBtn = document.getElementById('maximize-experience');
            if (maxBtn) maxBtn.click();
        } else {
            // Default behavior untuk window lain
            const minimizeButton = title_bar.querySelector(".minimize");
            this.resizeWindow(parentWindow, minimizeButton);
        }
      });
    });
  };

  getCurrentDateTime = () => {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    const formattedDate = now.toLocaleDateString(undefined, options);
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return { formattedDate, hours, minutes };
  };

  activateDateTimeUpdates = () => {
    const { formattedDate, hours, minutes } = this.getCurrentDateTime();
    this.currentDate.textContent = formattedDate;
    this.hoursMinutes.textContent = `${hours}:${minutes}`;
  };

  activateAppEvents = () => {
    this.apps.forEach((app) => {
      app.addEventListener("dblclick", () => this.openApp(app));
    });
  };

  openApp = (app) => {
    const appName = app.id.replace("_app", "");
    if (appName == "resume") {
      window.open(Resume);
    } else if (appName == "project") {
      window.parent.postMessage("Projects", "*");
    } else {
      this.openWindow(appName);
    }
  };

  activateBottomAppEvents = () => {
    this.bottomApps.forEach((bottomApp) => {
      bottomApp.addEventListener("click", () => {
        const appName = bottomApp.id.replace("_bottom", "");
        this.openWindow(appName);
      });
    });
  };

  openWindow = (appName) => {
    const currentWindow = document.getElementById(appName);
    currentWindow.style.display = "block";
    const bottomApp = document.getElementById(appName + "_bottom");
    if (bottomApp) bottomApp.classList.add("taskbar-opened");
    this.incrementMaxZIndex(currentWindow);
    
    currentWindow.addEventListener("mousedown", (event) => {
      if (!this.ds.stopped) {
        this.ds.stop();
      }
      if (
        !event.srcElement.classList.contains("close") &&
        !event.srcElement.classList.contains("restore")
      ) {
        this.incrementMaxZIndex(currentWindow);
      }
    });
  };

  activateMinimizeButtons = () => {
    this.minimizeButtons.forEach((minimizeButton) => {
      minimizeButton.addEventListener("click", () => {
        const currentWindow = minimizeButton.closest('.experience') || minimizeButton.closest('.about-me') || minimizeButton.closest('.contact') || minimizeButton.closest('.credits');
        
        // Skip resize logic for Experience since it handles its own maximize via restore button
        if (currentWindow && currentWindow.id === 'experience') return;

        if (currentWindow) {
            this.resizeWindow(currentWindow, minimizeButton);
        }
      });
    });
  };

  activateCloseButtons = () => {
    this.closeButtons.forEach((closeButton) => {
      closeButton.addEventListener("click", () => {
        const currentWindow = closeButton.parentElement.parentElement.parentElement;

        // Reset style
        currentWindow.removeAttribute("style");
        // Hapus class maximized jika ada (khusus experience)
        currentWindow.classList.remove("window-maximized");

        const content =
          currentWindow.id == "contact"
            ? currentWindow.querySelector(".content-light")
            : currentWindow.querySelector(".content");
        
        // HAPUS KODE LAMA EXPERIENCE DI SINI YANG MENYEBABKAN ERROR
        // Kita hanya perlu mereset scroll dan menyembunyikan window
        
        if (content) content.scrollTo(0, 0);
        
        currentWindow.style.display = "none";
        const bottomApp = document.getElementById(currentWindow.id + "_bottom");
        if (bottomApp) {
            if (bottomApp.classList.contains("taskbar-opened")) {
            bottomApp.classList.remove("taskbar-opened");
            }
            if (bottomApp.classList.contains("taskbar-selected")) {
            bottomApp.classList.remove("taskbar-selected");
            }
        }
      });
    });
  };

  activateRestoreButtons = () => {
    this.restoreButtons.forEach((restore) => {
      // PENTING: Jangan tambahkan event 'hide window' ke tombol maximize experience
      if (restore.id === 'maximize-experience') {
          return; 
      }

      restore.addEventListener("click", () => {
        const currentWindow = restore.parentElement.parentElement.parentElement;
        currentWindow.style.display = "none";
        const bottomApp = document.getElementById(currentWindow.id + "_bottom");
        if (bottomApp && bottomApp.classList.contains("taskbar-selected")) {
          bottomApp.classList.remove("taskbar-selected");
        }
      });
    });
  };

  resizeWindow = (window, minimizeButton) => {
    this.incrementMaxZIndex(window);
    if (window.style.width !== "100vw") {
      minimizeButton.classList.add("minimize-full");
      this.maximizeWindow(window);
    } else {
      if (minimizeButton.classList.contains("minimize-full")) {
        minimizeButton.classList.remove("minimize-full");
      }
      this.minimizeWindow(window);
    }
  };

  maximizeWindow = (currentWindow) => {
    const currentWindowID = currentWindow.id;
    let offset = 105;
    if (currentWindowID == "experience") {
      offset = 95;
    } else if (currentWindowID == "about-me") {
      offset = 175;
    }
    currentWindow.style.width = "100vw";
    currentWindow.style.height = "calc(100vh - " + offset + "px)";
    currentWindow.style.top = "calc(calc(100vh - " + offset + "px)/2)";
    currentWindow.style.left = "calc(100vw /2)";
  };

  minimizeWindow = (currentWindow) => {
    const currentWindowID = currentWindow.id;
    let offset = 80;
    if (currentWindowID == "credits" || currentWindowID == "about-me") {
      offset = 60;
    }
    currentWindow.style.width = offset + "vw";
    currentWindow.style.height = offset + "vh";
  };
}

export default Desktop;