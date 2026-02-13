import { useRef } from 'react';
import { Button } from './components/Button/Button';

export const App = () => {
  const myRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    console.log('Button clicked');
    if (myRef.current === null) return;

    myRef.current.focus();
  }

  function handleFocus() {
    console.log('Button focused');
  }

  function handleBlur() {
    console.log('Button blurred');
  }

  return (
    <div>
      <Button className="button1" ref={myRef} tooltipText="Check this out">
        Button 1
      </Button>

      <Button
        className="button2"
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        variant="secondary"
      >
        Button 2
      </Button>
      <Button
        className="button3"
        variant="tertiary"
        tooltipText="Voluptatem veritatis repellendus totam accusamus dolorem dicta est deserunt nemo, ex eos laboriosam quas numquam at cupiditate unde officiis quam voluptates assumenda."
      >
        Button 3
      </Button>
    </div>
  );
};
