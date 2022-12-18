import React, {type CSSProperties, useCallback, useState} from 'react';
import useResizeObserver from 'use-resize-observer';
import {Tooltip, type TooltipProps} from "@mui/material";
import clsx from "clsx";

type OverflowTextProps = {
  center?: boolean,
  className?: string,
  title: string,
  component?: 'h1',
  style?: CSSProperties,
} & Pick<TooltipProps, 'placement'>;

/**
 * Returns a <Typography> element wrapped in a tooltip. The tooltip will only be visible when the
 * <Typography> element doesn't have enough space (e.g. it has an ellipsis).
 */
export function OverflowText(props: OverflowTextProps) {
  const {center, className, placement, style, title, ...rest} = props;
  const [isOpen, setIsOpen] = useState(false);
  const {ref} = useResizeObserver<HTMLElement>();

  const resizeCallback = useCallback((el: HTMLParagraphElement) => {
    if (!el) {
      return;
    }
    // scrollWidth doesn't include margin, so add margin to the child to see if it overflows the
    // parent.
    const {marginLeft, marginRight} = window.getComputedStyle(el);
    const outerChildWidth = el.scrollWidth + parseInt(marginLeft, 10) + parseInt(marginRight, 10);
    setIsOpen(!!el.parentElement && outerChildWidth >= el.parentElement.clientWidth);
  }, [setIsOpen]);

  // We wrap the Typography in a div to ensure that no other child interferes with the width of the
  // parent container.
  // TODO(acorn1010): Replace center prop with a better solution for centering text.
  const centerStyle: CSSProperties = center ? {display: 'flex', justifyContent: 'center'} : {};
  return (
      <Tooltip title={isOpen ? title : ''} placement={placement ?? 'bottom'}>
        <div className='self-center min-w-0 w-full' style={{...centerStyle, ...style}}>
          <p
              className={clsx('max-w-fit truncate leading-none m-0 py-1 drop-shadow-[0_0_2px_rgba(0,0,0,1)]', className)}
              {...rest}
              ref={(e: HTMLParagraphElement) => {
                ref(e);
                resizeCallback(e);
              }}>
            {title}
          </p>
        </div>
      </Tooltip>
  );
}
