import { useRef } from 'react';
import { Button } from './components/Button/Button';
import { IoIosArrowDropright } from 'react-icons/io';

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
    <>
      <Button ref={myRef} variant="primary" icon={<IoIosArrowDropright />}>
        Submit
      </Button>

      <Button onFocus={handleFocus} onBlur={handleBlur} variant="secondary">
        Submit
      </Button>
      <Button variant="tertiary">Submit</Button>
    </>
  );
};
