import { useRef } from 'react';
import { Button } from './components/Button/Button';

export const App = () => {
  const myRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    console.log('Button clicked');
  }

  function handleFocus() {
    console.log('Button focused');
  }

  function handleBlur() {
    console.log('Button blurred');
  }

  return (
    <div>
      <Button
        className="button1"
        ref={myRef}
        tooltipText="Check this out"
        tooltipPosition="left"
      >
        Button 1
      </Button>

      {/* <Button
        className="button2"
        variant="tertiary"
        tooltipText="Voluptatem veritatis repellendus totam accusamus dolorem dicta est deserunt nemo, ex eos laboriosam quas numquam at cupiditate unde officiis quam voluptates assumenda."
      >
        Button 2
      </Button>

      <Button
        className="button3"
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        variant="secondary"
        tooltipText="Hello Hello Hello Everybody"
        tooltipPosition="right"
      >
        Button 3
      </Button> */}
    </div>
  );
};
