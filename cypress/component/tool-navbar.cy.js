import toolNavbar from '~/components/tool-navbar.vue';


describe('Navbar Component', () => {
  beforeEach(() => {
    const $route = { name: 'home' };
    const store = {
      state: {
        pageOrder: ['home', 'about', 'contact']
      },
      getters: {
        isPageAccessible: () => true
      },
      dispatch: () => {}
    };

    cy.spy(store, "dispatch").as("dispatchSpy");

    cy.mount(toolNavbar, {
      mocks: {
        $route,
        $store: store
      }
    });
  });

  it('lists all nav items', () => {
    cy.get('[data-cy=menu-item-home]').should('exist');
    cy.get('[data-cy=menu-item-about]').should('exist');
    cy.get('[data-cy=menu-item-contact]').should('exist');
  });

  it('the current page rout is highlighted with a different css style', () => {
    cy.get('[data-cy=menu-item-home]').should('have.class', 'dark');
    cy.get('[data-cy=menu-item-about]').should('not.have.class', 'dark');
    cy.get('[data-cy=menu-item-contact]').should('not.have.class', 'dark');
  });

  it('navigates to a page on nav item click', () => {
    cy.get('[data-cy=menu-item-about]').click();
    cy.get('@dispatchSpy').should('have.been.calledWith', 'navigateToPage', 'about');
  });
});