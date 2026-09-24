import { forwardRef } from 'react';
import Icon from './Icon';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  icon: 'p-2.5',
  'icon-sm': 'p-1.5',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    iconRight,
    fullWidth = false,
    type = 'button',
    className = '',
    ...props
  },
  ref
) {
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || '';
  const isIconOnly = size === 'icon' || size === 'icon-sm';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${variantClass} ${sizeClass} ${fullWidth ? 'w-full' : ''} ${className} no-tap-highlight`}
      {...props}
    >
      {loading && <Icon name="refresh" className={`h-4 w-4 animate-spin ${isIconOnly ? '' : '-ml-1'}`} />}
      {!loading && icon && <Icon name={icon} className={isIconOnly ? 'h-5 w-5' : 'h-4 w-4'} />}
      {!isIconOnly && children && <span>{children}</span>}
      {!loading && iconRight && !isIconOnly && <Icon name={iconRight} className="h-4 w-4" />}
    </button>
  );
});

export default Button;