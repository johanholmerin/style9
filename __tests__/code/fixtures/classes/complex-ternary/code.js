import style9 from 'style9';
const styles = style9.create({
  button: {
    marginLeft: '0.5rem',
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
    padding: '0',
    height: '19px',
    width: '35px',
    borderWidth: '2px',
    borderColor: 'transparent',
    borderRadius: '9999px',
    cursor: 'pointer',
    transitionDuration: '50ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0,0.2, 1)',
    transitionProperty: 'background-color, border-color, color, fill, stroke',
    ':focus': {
      outline: 'none'
    }
  },
  disabled: {
    backgroundColor: '#9ca3af'
  },
  enabled: {
    backgroundColor: '#059669'
  },
  toggle: {
    pointerEvents: 'none',
    display: 'inline-block',
    height: '15px',
    width: '15px',
    borderRadius: '9999px',
    backgroundColor: '#fff',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    animationDuration: '200ms',
    lineHeight: '1.5rem',
    fontSize: '1rem',
    transitionTimingFunction: 'cubic-bezier(0.4, 0,0.2, 1)',
    transitionDuration: '50ms'
  },
  toggle__enabled: {
    transform: 'translateX(1rem)'
  },
  toggle__disabled: {
    transform: 'translateX(0)'
  }
});

styles('toggle', checked ? 'toggle__enabled' : 'toggle__disabled');
