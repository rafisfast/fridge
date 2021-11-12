import React, { createContext, useContext } from 'react';

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

export const onTextDoublePress = (e,props) => {
  
  const [texttransformerRef,setShapes,shapes,stage] = props
  const textNode = e.target

  textNode.hide()
  texttransformerRef.current.hide()

  const textPosition = textNode.absolutePosition();

  // so position of textarea will be the sum of positions above:
  const areaPosition = {
    x: stage.current.container().offsetLeft + textPosition.x,
    y: stage.current.container().offsetTop + textPosition.y,
  };

  // create textarea and style it
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);

  // apply many styles to match text on canvas as close as possible
  // remember that text rendering on canvas and on the textarea can be different
  // and sometimes it is hard to make it 100% the same. But we will try...
  textarea.value = textNode.text();
  textarea.style.position = 'absolute';
  textarea.style.top = areaPosition.y + 'px';
  textarea.style.left = areaPosition.x + 'px';
  textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
  textarea.style.height =
  textNode.height() - textNode.padding() * 2 + 5 + 'px';
  textarea.style.fontSize = textNode.fontSize() + 'px';
  textarea.style.border = 'none';
  textarea.style.padding = '0px';
  textarea.style.margin = '0px';
  textarea.style.overflow = 'hidden';
  textarea.style.background = 'none';
  textarea.style.outline = 'none';
  textarea.style.resize = 'none';
  textarea.style.lineHeight = textNode.lineHeight();
  textarea.style.fontFamily = textNode.fontFamily();
  textarea.style.transformOrigin = 'left top';
  textarea.style.textAlign = textNode.align();
  textarea.style.color = textNode.fill();

  const px = 0;
  // also we need to slightly move textarea on firefox
  // because it jumps a bit
  const isFirefox =
    navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isFirefox) {
    px += 2 + Math.round(textNode.fontSize() / 20);
  }

  // reset height
  textarea.style.height = 'auto';
  // after browsers resized it we can set actual value
  textarea.style.height = textarea.scrollHeight + 3 + 'px';

  textarea.focus();

  function removeTextarea() {
    textarea.parentNode.removeChild(textarea);
    window.removeEventListener('click', handleOutsideClick);
    textNode.show();
    texttransformerRef.current.show();
    texttransformerRef.current.forceUpdate();
  }

  function setTextareaWidth(newWidth) {
    if (!newWidth) {
      // set width for placeholder
      newWidth = textNode.placeholder.length * textNode.fontSize();
    }
    // some extra fixes on different browsers
    var isSafari = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    var isFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isSafari || isFirefox) {
      newWidth = Math.ceil(newWidth);
    }

    var isEdge =
      document.documentMode || /Edge/.test(navigator.userAgent);
    if (isEdge) {
      newWidth += 1;
    }
    textarea.style.width = newWidth + 'px';
  }

  textarea.addEventListener('keydown', function (e) {
    // hide on enter
    // but don't hide on shift + enter
    if (e.keyCode === 13 && !e.shiftKey) {
      textNode.text(textarea.value);
      removeTextarea();
    }
    // on esc do not set value back to node
    if (e.keyCode === 27) {
      removeTextarea();
    }
  });

  textarea.addEventListener('keydown', function (e) {
    const scale = textNode.getAbsoluteScale().x;
    setTextareaWidth(textNode.width() * scale);
    textarea.style.height = 'auto';
    textarea.style.height =
    textarea.scrollHeight + textNode.fontSize() + 'px';
  });

  function handleOutsideClick(e) {
    if (e.target !== textarea) {
      textNode.text(textarea.value);
      removeTextarea();
    }
  }
  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick);
  });

}

export const onTransformEnd = (e,props) => {
  const [shapes,setshapes] = props
  const id = e.target.id();
  const s = shapes.objects.slice()
  s[id].x = e.target.x();
  s[id].y = e.target.y();
  s[id].scale = Math.floor(e.target.scaleX()*100)/100;
  setshapes(s);
}

export const onSelect = (e,props) => {
  // console.log(e.target.getAbsolutePosition())
  const [setselected,setanchors,background,transformerRef,texttransformerRef,stage] = props
  const id = e.target.id();
  const type = e.target.name()
  // console.log(e.target, stage)
  console.log(e.target, background.current, e.target.id(),e.target.name());
  if (id) {
    // console.log(e.target)
    if (type) {
      if (type === "Rect") {
        setanchors(["top-right","top-left","bottom-left","bottom-right","middle-right","middle-left","top-center","bottom-center"])
        transformerRef.current.nodes([e.target]);
        texttransformerRef.current.nodes([]);
      } else if (type === "Text") {
        setanchors(["middle-right","middle-left","top-center","bottom-center"])
        texttransformerRef.current.nodes([e.target]);
        transformerRef.current.nodes([]);
      } else {
        setanchors(["top-right","top-left","bottom-left","bottom-right"])
        transformerRef.current.nodes([e.target]);
        texttransformerRef.current.nodes([])
      }
      setselected(e.target)
    }
  } else if (
    e.target === stage.current ||
    e.target === background.current ||
    e.target.parent === background.current
  ) {
    transformerRef.current.nodes([]);
    texttransformerRef.current.nodes([])
    setselected();
  }
  // console.log(e.target.id())
  // setselected(id)
  // setselected(e.target.id())
};