import { Button } from './components/Button/Button';
import { FaPlus } from 'react-icons/fa';

export const App = () => {
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
    <>
      <Button>Submit</Button>

      <Button
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        variant="secondary"
      >
        Submit
      </Button>
      <Button variant="tertiary">Submit</Button>
    </>
  );
};
