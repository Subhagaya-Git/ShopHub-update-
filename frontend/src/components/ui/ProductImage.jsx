import { useState } from 'react';
import Icon from './Icon';

const placeholderSvg = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#f1f5f9"/><path d="M200 140c-33 0-60 27-60 60s27 60 60 60 60-27 60-60-27-60-60-60zm0-80c-77 0-140 63-140 140s63 140 140 140 140-63 140-140-63-140-140-140zm-50 70c8 0 15-7 15-15s-7-15-15-15-15 7-15 15 7 15 15 15z" fill="#cbd5e1"/></svg>'
);

export default function ProductImage({ src, alt, className = '', rounded = 'rounded-xl', ...props }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${rounded} ${className}`}>
        <Icon name="image" className="h-10 w-10 text-slate-300 dark:text-slate-600" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}