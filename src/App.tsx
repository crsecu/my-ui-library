import { useRef } from 'react';
import { Button } from './components/Button/Button';

export const App = () => {
  const myRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="app">
      <span style={{ height: '300px', backgroundColor: 'green' }}></span>
      <Button
        className="button1"
        ref={myRef}
        tooltipText="Voluptatem veritatis repellendus totam accusamus dolorem dicta est deserunt nemo, ex eos laboriosam quas numquam at cupiditate unde officiis quam voluptates assumenda."
        // tooltipText="Voluptatem veritatis"

        tooltipAlignment="center"
      >
        Button 1
      </Button>
      <span style={{ height: '300px', backgroundColor: 'green' }}></span>

      <Button className="button3" variant="secondary" tooltipText="Hello Hello Hello Everybody" tooltipPosition="left">
        Button 3
      </Button>
    </div>
  );
};
