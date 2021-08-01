import React, { FC, useState } from 'react';
// import styled from 'styled-components';
import styled from 'styled-components';

import Display from './components/Display';
import Pad from './components/Pad';
import { Digit, Operator } from './types';

const StyledApp = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue" ,Arial ,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  width: 100%;
  max-width: 320px;
  margin: 10em auto;

`

const App: FC = () => {
  // Calculator states
  const [memory] = useState<number>(0)
  const [result, setResult] = useState<number>(0) 
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(true)
  const [pendingOperator, setPendingOperator] = useState<Operator>()
  const [display, setDisplay] = useState<string>('0')

  const calculate = (rightOperand: number, pendingOperator: Operator): boolean => {
    let newResult = result

    switch (pendingOperator){
      case '+':
        newResult += rightOperand
        break
      case '-':
        newResult -= rightOperand
        break
      case '×':
        newResult *= rightOperand
        break
      case '÷':
        if(rightOperand === 0){
          return false
        }      

        newResult /= rightOperand
    }

    setResult(newResult)
    setDisplay(newResult.toString().toString().slice(0, 12))

    return true
  }

  // Pad buutons handler

  const onDigitButtonClick = (digit: Digit) => {
    let newDisplay = display

    if((display === '0' && digit === 0) || display.length > 12) {
      return
    }
    if(waitingForOperand){
      newDisplay = ''
      setWaitingForOperand(false)
    }
    if(display !== '0'){
      newDisplay = newDisplay + digit.toString()
    }else{
      newDisplay = digit.toString()
    }

    setDisplay(newDisplay)
  }

  const onOperatorButtonClick = (operator: Operator) => {
    const operand = Number(display)

    if(typeof pendingOperator !== 'undefined' && !waitingForOperand){
      if(!calculate(operand, pendingOperator)){
        return
      }
    }else {
      setResult(operand)
    }

    setPendingOperator(operator)
    setWaitingForOperand(true)
  }

  const onEqualButtonClick = () => {
    const operand = Number(display)

    if(typeof pendingOperator !== 'undefined' && !waitingForOperand){
      if(!calculate(operand, pendingOperator)){
        return
      }
      setPendingOperator(undefined)
    }else{
      setDisplay(operand.toString())
    }
    
    setResult(operand)
    setWaitingForOperand(true)
  }


  const onAllClearButtonClick = () => {
    setResult(0)
    setPendingOperator(undefined)
    setDisplay('0')
    setWaitingForOperand(true)
  }

  const onClearEntryButtonClick = () => {
    setDisplay('0')
    setWaitingForOperand(true)
  }

  return (
    <StyledApp>
      <Display value={display} hasMemory={memory !== 0} expression={typeof pendingOperator !== 'undefined' ? `${result}${pendingOperator}${waitingForOperand ? '' : display}` : ''} />
      <Pad 
        onDigitButtonClick={onDigitButtonClick}
        onOperatorButtonClick={onOperatorButtonClick}
        onEqualButtonClick={onEqualButtonClick}
        onAllClearButtonClick={onAllClearButtonClick}
        onClearEntryButtonClick={onClearEntryButtonClick} />
    </StyledApp>
  )
}

export default App;
