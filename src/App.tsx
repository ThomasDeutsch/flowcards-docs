import HelloWorld from "./hello-world.mdx";
import React from 'react';
import {expect, AssertionError} from 'chai'

interface TestProps {
  title: string;
}

function Test({title}: TestProps) {
  try {
    expect(2).to.equal(3);
  } catch(error) {
    console.log('error: ', error)
    return <div>
    </div>
  }
  return <h1>true</h1>
}

export function App() {
  return (
    <div>
      <Test title="testtitle"></Test>
      <HelloWorld />
      
    </div>
  );
}
