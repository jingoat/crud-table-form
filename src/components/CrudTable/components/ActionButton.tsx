import React from 'react';


interface ActionButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: boolean;
  permission?: ((pers: string[]) => void) | string[] | number[] | string;
}

// 简单封装 方便以后拓展
const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { style, disabled, children, permission, ...rest } = props;
  const disabledStyle = disabled ? { color: 'rgba(0,0,0,.25)', cursor: 'not-allowed' } : {};
  if (permission) {
    const pers = []; /** 权限List */
    const access = 1;

    if (!access) {
      return null;
    }
  }

  return (
    <a style={{ ...style, ...disabledStyle }} {...rest}>
      {children}
    </a>
  );
};

export default ActionButton;
