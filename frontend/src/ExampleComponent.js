// ExampleComponent.js
import React from 'react';
import { Card } from "@/components/ui/card";
import withShad from './withshad';

const ExampleCard = (props) => {
  return (
    <Card {...props}>
      {/* Card content goes here */}
    </Card>
  );
};

export default withShad(ExampleCard);
