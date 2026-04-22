(() => {
    const menuToggle = document.getElementById('menuToggle');
    const menuPrincipal = document.getElementById('menuPrincipal');
    const desktopMenu = window.matchMedia('(min-width: 1024px)');

    function setMenuState(isOpen) {
        if (!menuToggle || !menuPrincipal) return;

        const isDesktop = desktopMenu.matches;
        const expanded = isDesktop || isOpen;

        menuToggle.setAttribute('aria-expanded', String(expanded));
        menuToggle.setAttribute('aria-label', expanded && !isDesktop ? 'Fechar menu' : 'Abrir menu');
        menuPrincipal.setAttribute('aria-hidden', String(!expanded));

        menuPrincipal.querySelectorAll('a, button').forEach(link => {
            if (expanded) {
                link.removeAttribute('tabindex');
            } else {
                link.setAttribute('tabindex', '-1');
            }
        });
    }

    function syncMenuState() {
        setMenuState(menuPrincipal && menuPrincipal.classList.contains('active'));
    }

    if (menuToggle && menuPrincipal) {
        menuToggle.setAttribute('aria-controls', menuPrincipal.id);
        menuToggle.setAttribute('aria-expanded', 'false');
        menuPrincipal.setAttribute('aria-label', 'Principal');
        syncMenuState();

        menuToggle.addEventListener('click', () => {
            window.requestAnimationFrame(syncMenuState);
        });

        menuPrincipal.addEventListener('click', event => {
            if (event.target.closest('a, button')) {
                window.requestAnimationFrame(syncMenuState);
            }
        });

        document.addEventListener('click', () => {
            window.requestAnimationFrame(syncMenuState);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menuPrincipal.classList.contains('active')) {
                menuToggle.classList.remove('active');
                menuPrincipal.classList.remove('active');
                syncMenuState();
                menuToggle.focus();
            }
        });

        desktopMenu.addEventListener('change', syncMenuState);
    }

    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    let lastModalTrigger = null;

    function getFocusableElements(container) {
        return Array.from(container.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(element => !element.hasAttribute('hidden') && element.offsetParent !== null);
    }

    function focusModal(modal) {
        const focusable = getFocusableElements(modal);
        const firstFocusable = focusable[0] || modal.querySelector('[role="dialog"]');

        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    function syncModalState(modal) {
        const isOpen = modal.classList.contains('is-open');
        modal.setAttribute('aria-hidden', String(!isOpen));

        if (isOpen) {
            window.requestAnimationFrame(() => focusModal(modal));
        } else if (lastModalTrigger && document.contains(lastModalTrigger)) {
            lastModalTrigger.focus();
            lastModalTrigger = null;
        }
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            lastModalTrigger = trigger;
        });
    });

    modalOverlays.forEach(modal => {
        const dialog = modal.querySelector('[role="dialog"]');

        if (dialog) {
            dialog.setAttribute('tabindex', '-1');
        }

        syncModalState(modal);

        new MutationObserver(() => syncModalState(modal)).observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });

        modal.addEventListener('keydown', event => {
            if (event.key !== 'Tab' || !modal.classList.contains('is-open')) return;

            const focusable = getFocusableElements(modal);
            if (!focusable.length) {
                event.preventDefault();
                dialog && dialog.focus();
                return;
            }

            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === firstFocusable) {
                event.preventDefault();
                lastFocusable.focus();
            } else if (!event.shiftKey && document.activeElement === lastFocusable) {
                event.preventDefault();
                firstFocusable.focus();
            }
        });
    });
})();
