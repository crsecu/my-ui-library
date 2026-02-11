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
      <Button ref={myRef}>Submit</Button>

      <Button
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        variant="secondary"
      >
        Click me
      </Button>
      <Button variant="tertiary">Submit</Button>
    </div>
  );
};
