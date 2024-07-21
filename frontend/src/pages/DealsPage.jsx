import React, { useEffect, useState } from 'react';
import DealsList from '../components/DealsList';
import {Navigate} from 'react-router-dom'

const DealsPage = () => {

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <DealsList />
    </div>
  );
};

export default DealsPage;