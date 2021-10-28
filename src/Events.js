import React from 'react';

const Transformlock = (e) => {
  const layer = e.target
  layer.width(layer.width() * layer.scaleX())
  layer.height(layer.height() * layer.scaleY())
  layer.scaleX(1)
  layer.scaleY(1)
}

export const onTextTransform = (e) => {
  Transformlock(e)
}

export const onRectTransform = (e) => {
  Transformlock(e)
}

export const onTransform = () => {

}