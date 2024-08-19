import React, { useEffect, useState } from 'react';
import DealsList from '../components/DealsList';
import {Navigate} from 'react-router-dom'

const DealsPage = () => {

  return (
    <div>
      <DealsList />
    </div>
  );
};

export default DealsPage;