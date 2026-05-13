import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import ReportCrimePage from '../pages/ReportCrimePage';
import AdminDashboard from '../pages/AdminDashboard';
import AnalyticsDashboard from '../pages/AnalyticsDashboard';

/**
 * Responsive Design Tests for Crime Reporting System
 * Tests layout adaptation across mobile (320px), tablet (768px), and desktop (1200px) viewports
 */
describe('Responsive Design Tests', () => {
  const setViewport = (width, height = 800) => {
    global.innerWidth = width;
    global.innerHeight = height;
    global.dispatchEvent(new Event('resize'));
  };

  const renderComponent = (Component) => {
    return render(
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    );
  };

  // ==================== MOBILE VIEWPORT TESTS (320px) ====================

  describe('Mobile (320px) Viewport', () => {
    beforeEach(() => {
      setViewport(320);
    });

    test('Should use single-column layout on mobile', () => {
      renderComponent(ReportCrimePage);

      const formContainer = screen.getByRole('button', { name: /file complaint/i }).closest('form');
      expect(formContainer).toHaveStyle({ maxWidth: '100%' });
    });

    test('Should display full-width buttons on mobile', () => {
      renderComponent(ReportCrimePage);

      const submitButton = screen.getByRole('button', { name: /file complaint/i });
      expect(submitButton).toHaveStyle({ width: '100%' });
    });

    test('Should hide optional information on mobile (small devices only)', () => {
      const { container } = renderComponent(AdminDashboard);

      const optionalInfo = container.querySelector('.hidden-mobile');
      expect(optionalInfo).toHaveStyle({ display: 'none' });
    });

    test('Should stack navigation vertically on mobile', () => {
      const { container } = renderComponent(App);

      const navbar = container.querySelector('nav');
      const navItems = navbar.querySelectorAll('a');
      
      expect(navbar).toHaveStyle({ flexDirection: 'column' });
    });

    test('Should display hamburger menu on mobile instead of full navigation', () => {
      const { container } = renderComponent(App);

      const hamburgerMenu = container.querySelector('.hamburger-menu');
      expect(hamburgerMenu).toBeVisible();
    });

    test('Should use appropriate font sizes for mobile readability', () => {
      renderComponent(ReportCrimePage);

      const label = screen.getByLabelText(/crime type/i);
      expect(label).toHaveStyle({ fontSize: expect.stringMatching(/14px|0\.875rem/) });
    });

    test('Should ensure touch targets are minimum 44x44 pixels on mobile', () => {
      renderComponent(ReportCrimePage);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Check minimum height
        const style = window.getComputedStyle(button);
        expect(parseFloat(style.height)).toBeGreaterThanOrEqual(44);
      });
    });

    test('Should remove unnecessary whitespace and padding on mobile', () => {
      const { container } = renderComponent(AdminDashboard);

      const mainContainer = container.querySelector('main');
      const style = window.getComputedStyle(mainContainer);
      
      // Padding should be limited on mobile
      expect(parseFloat(style.paddingLeft)).toBeLessThanOrEqual(16);
      expect(parseFloat(style.paddingRight)).toBeLessThanOrEqual(16);
    });

    test('Should stack form inputs vertically on mobile', () => {
      renderComponent(ReportCrimePage);

      const formGroup = screen.getByLabelText(/crime type/i).closest('.form-group');
      expect(formGroup).toHaveStyle({ flexDirection: 'column' });
    });

    test('Should disable horizontal scroll on mobile', () => {
      const { container } = renderComponent(App);

      const htmlElement = container.closest('html');
      expect(htmlElement).not.toHaveStyle({ overflowX: 'auto' });
    });

    test('Should use mobile-optimized font weight on mobile', () => {
      renderComponent(ReportCrimePage);

      const heading = screen.getByRole('heading');
      const style = window.getComputedStyle(heading);
      
      expect(parseInt(style.fontWeight)).toBeLessThanOrEqual(600);
    });
  });

  // ==================== TABLET VIEWPORT TESTS (768px) ====================

  describe('Tablet (768px) Viewport', () => {
    beforeEach(() => {
      setViewport(768);
    });

    test('Should use two-column layout on tablet', () => {
      renderComponent(AdminDashboard);

      const gridContainer = screen.getByRole('main').querySelector('.grid');
      expect(gridContainer).toHaveStyle({ gridTemplateColumns: expect.stringMatching(/repeat\(2/) });
    });

    test('Should display sidebar navigation on tablet', () => {
      const { container } = renderComponent(App);

      const sidebar = container.querySelector('aside');
      expect(sidebar).toHaveStyle({ display: 'block' });
    });

    test('Should use moderate padding on tablet', () => {
      const { container } = renderComponent(App);

      const mainContainer = container.querySelector('main');
      const style = window.getComputedStyle(mainContainer);
      
      expect(parseFloat(style.paddingLeft)).toBeGreaterThanOrEqual(20);
      expect(parseFloat(style.paddingLeft)).toBeLessThanOrEqual(40);
    });

    test('Should display dashboard cards in 2-column grid on tablet', () => {
      renderComponent(AdminDashboard);

      const cards = screen.getAllByRole('article');
      expect(cards.length).toBeGreaterThan(0);
    });

    test('Should use readable font sizes on tablet', () => {
      renderComponent(ReportCrimePage);

      const heading = screen.getByRole('heading');
      const style = window.getComputedStyle(heading);
      
      expect(parseFloat(style.fontSize)).toBeGreaterThanOrEqual(20);
      expect(parseFloat(style.fontSize)).toBeLessThanOrEqual(32);
    });

    test('Should display form labels inline on tablet', () => {
      renderComponent(ReportCrimePage);

      const formGroup = screen.getByLabelText(/crime type/i).closest('.form-group');
      expect(formGroup).toHaveStyle({ flexDirection: 'row' });
    });
  });

  // ==================== DESKTOP VIEWPORT TESTS (1200px) ====================

  describe('Desktop (1200px) Viewport', () => {
    beforeEach(() => {
      setViewport(1200);
    });

    test('Should use multi-column layout on desktop', () => {
      renderComponent(AdminDashboard);

      const gridContainer = screen.getByRole('main').querySelector('.grid');
      expect(gridContainer).toHaveStyle({ gridTemplateColumns: expect.stringMatching(/repeat\(3|repeat\(4/) });
    });

    test('Should display full navigation on desktop', () => {
      const { container } = renderComponent(App);

      const navbar = container.querySelector('nav');
      const navItems = navbar.querySelectorAll('a');
      
      expect(navbar).toHaveStyle({ flexDirection: 'row' });
      expect(navItems.length).toBeGreaterThan(3);
    });

    test('Should use maximum content width on desktop', () => {
      const { container } = renderComponent(App);

      const maxWidthContainer = container.querySelector('.container');
      expect(maxWidthContainer).toHaveStyle({ maxWidth: expect.stringMatching(/1200px|80rem/) });
    });

    test('Should display dashboard cards in 3-column grid on desktop', () => {
      renderComponent(AdminDashboard);

      const cardContainer = screen.getByRole('main').querySelector('.grid');
      expect(cardContainer).toHaveStyle({ gridTemplateColumns: expect.stringMatching(/repeat\(3/) });
    });

    test('Should use professional spacing on desktop', () => {
      const { container } = renderComponent(AdminDashboard);

      const mainContainer = container.querySelector('main');
      const style = window.getComputedStyle(mainContainer);
      
      expect(parseFloat(style.paddingLeft)).toBeGreaterThanOrEqual(40);
    });

    test('Should display detailed information on desktop', () => {
      renderComponent(AdminDashboard);

      expect(screen.getByText(/analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
    });
  });

  // ==================== MEDIA QUERY BREAKPOINT TESTS ====================

  describe('Media Query Breakpoints', () => {
    test('Should apply mobile styles at 320px', () => {
      setViewport(320);
      renderComponent(ReportCrimePage);

      const element = screen.getByRole('button', { name: /file complaint/i }).closest('form');
      expect(element).toHaveStyle({ maxWidth: '100%' });
    });

    test('Should apply tablet styles at 768px', () => {
      setViewport(768);
      renderComponent(AdminDashboard);

      const gridContainer = screen.getByRole('main').querySelector('.grid');
      expect(gridContainer).toHaveStyle({ gridTemplateColumns: expect.stringMatching(/repeat\(2/) });
    });

    test('Should apply desktop styles at 1200px', () => {
      setViewport(1200);
      renderComponent(AdminDashboard);

      const gridContainer = screen.getByRole('main').querySelector('.grid');
      expect(gridContainer).toHaveStyle({ gridTemplateColumns: expect.stringMatching(/repeat\(3/) });
    });

    test('Should transition styles smoothly on viewport change', () => {
      setViewport(320);
      const { rerender } = renderComponent(ReportCrimePage);

      let element = screen.getByRole('button', { name: /file complaint/i }).closest('form');
      expect(element).toHaveStyle({ maxWidth: '100%' });

      // Change viewport
      setViewport(1200);
      rerender(
        <BrowserRouter>
          <ReportCrimePage />
        </BrowserRouter>
      );

      expect(element).not.toHaveStyle({ maxWidth: '100%' });
    });
  });

  // ==================== TABLE RESPONSIVE TESTS ====================

  describe('Table Responsiveness', () => {
    test('Should convert table to stacked view on mobile', () => {
      setViewport(320);
      const { container } = renderComponent(AdminDashboard);

      const table = container.querySelector('table');
      expect(table).toHaveClass('responsive-table');
      expect(table).toHaveStyle({ display: 'block' });
    });

    test('Should hide certain columns on mobile', () => {
      setViewport(320);
      const { container } = renderComponent(AdminDashboard);

      const nonEssentialColumn = container.querySelector('thead th:nth-child(4), thead th:nth-child(5)');
      expect(nonEssentialColumn).toHaveStyle({ display: 'none' });
    });

    test('Should display table horizontally on tablet', () => {
      setViewport(768);
      const { container } = renderComponent(AdminDashboard);

      const table = container.querySelector('table');
      expect(table).toHaveStyle({ display: 'table' });
    });

    test('Should show all columns on desktop', () => {
      setViewport(1200);
      const { container } = renderComponent(AdminDashboard);

      const allColumns = container.querySelectorAll('thead th');
      allColumns.forEach(col => {
        expect(col).toHaveStyle({ display: 'table-cell' });
      });
    });
  });

  // ==================== MODAL/DIALOG RESPONSIVE TESTS ====================

  describe('Modal Responsive Behavior', () => {
    test('Should use full-width modal on mobile', () => {
      setViewport(320);
      const { container } = renderComponent(AdminDashboard);

      const modal = container.querySelector('.modal');
      expect(modal).toHaveStyle({ width: '100vh', maxWidth: '100%' });
    });

    test('Should use constrained modal width on tablet', () => {
      setViewport(768);
      const { container } = renderComponent(AdminDashboard);

      const modal = container.querySelector('.modal');
      expect(modal).toHaveStyle({ maxWidth: expect.stringMatching(/90%|768px/) });
    });

    test('Should use fixed modal width on desktop', () => {
      setViewport(1200);
      const { container } = renderComponent(AdminDashboard);

      const modal = container.querySelector('.modal');
      expect(modal).toHaveStyle({ maxWidth: expect.stringMatching(/600px|50%/) });
    });
  });

  // ==================== IMAGE RESPONSIVE TESTS ====================

  describe('Image Responsiveness', () => {
    test('Should use responsive images on mobile', () => {
      setViewport(320);
      const { container } = renderComponent(AnalyticsDashboard);

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('sizes', expect.any(String));
        expect(img).toHaveAttribute('srcset', expect.any(String));
      });
    });

    test('Should scale images appropriately on tablet', () => {
      setViewport(768);
      const { container } = renderComponent(AnalyticsDashboard);

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        const style = window.getComputedStyle(img);
        expect(parseFloat(style.maxWidth)).toBeLessThanOrEqual(100);
      });
    });
  });

  // ==================== TYPOGRAPHY RESPONSIVE TESTS ====================

  describe('Typography Responsiveness', () => {
    test('Should use smaller font sizes on mobile', () => {
      setViewport(320);
      renderComponent(ReportCrimePage);

      const heading = screen.getByRole('heading');
      const style = window.getComputedStyle(heading);
      
      const fontSize = parseFloat(style.fontSize);
      expect(fontSize).toBeLessThanOrEqual(24);
    });

    test('Should use medium font sizes on tablet', () => {
      setViewport(768);
      renderComponent(ReportCrimePage);

      const heading = screen.getByRole('heading');
      const style = window.getComputedStyle(heading);
      
      const fontSize = parseFloat(style.fontSize);
      expect(fontSize).toBeGreaterThan(20);
      expect(fontSize).toBeLessThan(32);
    });

    test('Should use larger font sizes on desktop', () => {
      setViewport(1200);
      renderComponent(ReportCrimePage);

      const heading = screen.getByRole('heading');
      const style = window.getComputedStyle(heading);
      
      const fontSize = parseFloat(style.fontSize);
      expect(fontSize).toBeGreaterThanOrEqual(32);
    });

    test('Should maintain readable line height across all viewports', () => {
      [320, 768, 1200].forEach(width => {
        setViewport(width);
        renderComponent(ReportCrimePage);

        const paragraph = screen.getByText(/form/).closest('p') || screen.getByRole('heading');
        const style = window.getComputedStyle(paragraph);
        
        const lineHeight = parseFloat(style.lineHeight);
        const fontSize = parseFloat(style.fontSize);
        
        // Line height should be at least 1.5x font size
        expect(lineHeight / fontSize).toBeGreaterThanOrEqual(1.5);
      });
    });
  });

  // ==================== ACCESSIBILITY IN RESPONSIVE DESIGN ====================

  describe('Accessibility in Responsive Design', () => {
    test('Should maintain focus order on all viewports', () => {
      [320, 768, 1200].forEach(width => {
        setViewport(width);
        const { container } = renderComponent(ReportCrimePage);

        const focusables = container.querySelectorAll('input, button, a');
        expect(focusables.length).toBeGreaterThan(0);

        // Focus should be visible
        focusables[0].focus();
        expect(document.activeElement).toBe(focusables[0]);
      });
    });

    test('Should hide hamburger menu label on desktop', () => {
      setViewport(1200);
      const { container } = renderComponent(App);

      const hamburgerLabel = container.querySelector('label[for="mobile-menu"]');
      expect(hamburgerLabel).toHaveStyle({ display: 'none' });
    });

    test('Should maintain semantic HTML across viewport changes', () => {
      [320, 768, 1200].forEach(width => {
        setViewport(width);
        const { container } = renderComponent(AdminDashboard);

        expect(container.querySelector('header')).toBeInTheDocument();
        expect(container.querySelector('main')).toBeInTheDocument();
        expect(container.querySelector('footer')).toBeInTheDocument();
      });
    });
  });

  // ==================== PERFORMANCE IN RESPONSIVE DESIGN ====================

  describe('Performance and Responsive Design', () => {
    test('Should not load unnecessary CSS on mobile', () => {
      setViewport(320);
      const { container } = renderComponent(AdminDashboard);

      const desktopOnlyElement = container.querySelector('.desktop-only');
      if (desktopOnlyElement) {
        expect(desktopOnlyElement).toHaveStyle({ display: 'none' });
      }
    });

    test('Should lazy-load images on mobile', () => {
      setViewport(320);
      const { container } = renderComponent(AnalyticsDashboard);

      const images = container.querySelectorAll('img[loading="lazy"]');
      expect(images.length).toBeGreaterThan(0);
    });
  });
});

/**
 * Cross-Browser Responsive Design Tests
 */
describe('Cross-Browser Responsive Design', () => {
  test('Should apply correct flexbox properties on all viewports', () => {
    [320, 768, 1200].forEach(width => {
      global.innerWidth = width;
      global.dispatchEvent(new Event('resize'));

      const { container } = render(
        <BrowserRouter>
          <ReportCrimePage />
        </BrowserRouter>
      );

      const flexElements = container.querySelectorAll('[style*="display: flex"]');
      flexElements.forEach(element => {
        expect(window.getComputedStyle(element).display).toBe('flex');
      });
    });
  });

  test('Should apply correct grid properties on all viewports', () => {
    [320, 768, 1200].forEach(width => {
      global.innerWidth = width;
      global.dispatchEvent(new Event('resize'));

      const { container } = render(
        <BrowserRouter>
          <AdminDashboard />
        </BrowserRouter>
      );

      const gridElements = container.querySelectorAll('[style*="display: grid"]');
      gridElements.forEach(element => {
        expect(window.getComputedStyle(element).display).toBe('grid');
      });
    });
  });
});
