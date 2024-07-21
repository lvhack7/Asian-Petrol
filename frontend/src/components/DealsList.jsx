import React, { useEffect, useState } from 'react';
import { Table, Button, notification } from 'antd';
import dealService from '../services/dealService';
import DealFormModal from './DealForm';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}.${month}.${year}`;
};

const DealsList = () => {
  const [deals, setDeals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const handleCreateDeal = async (values, formType) => {
    const { dealNumber, date, factory, fuelType, ...rest } = values;
    const body = {
      dealNumber,
      date,
      factory,
      fuelType,
      type: formType,
      data: { ...rest },
    };
    console.log(body);

    try {
      await dealService.createDeal(body);
      await fetchDeals();
      notification.success({ message: 'Сделка успешно сохранена!' });
    } catch (error) {
      notification.error({ message: 'Не удалось сохранить сделку!' });
    } finally {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data } = await dealService.getDeals();
      setDeals(data);
    } catch (error) {
      localStorage.removeItem('token');
      notification.error({ message: 'Не удалось получить сделки!' });
    }
  };

  const columns = [
    { title: '# Сделки', dataIndex: 'dealNumber', key: 'dealNumber',
      sorter: (a, b) => Number(a.dealNumber) - Number(b.dealNumber)
    },
    { title: 'Дата', dataIndex: 'date', key: 'date', 
      render: (text) => formatDate(text), 
      sorter: (a, b) => new Date(a.date) - new Date(b.date) 
    },
    { title: 'Завод', dataIndex: 'factory', key: 'factory' },
    { title: 'Вид ГСМ', dataIndex: 'fuelType', key: 'fuelType' },
    {
      title: 'Действия',
      key: 'actions',
      render: (record) => (
        <Button
          type="link"
          onClick={() => {
            const {dealNumber, date, factory, fuelType, ...rest} = record
            const tempData = {...rest}
            let type = ''
            if (tempData['Supplier']) type = 'Supplier'
            if (tempData['Buyer']) type = 'Buyer'
            if (tempData['Forwarder']) type = 'Forwarder'
            
            const data = tempData[type]
            const finalObj = {
              ...data, dealNumber, date, factory, fuelType, type: type.toLocaleLowerCase()
            }
            setEditRecord(finalObj);
            setModalVisible(true);
          }}
        >
          Редактировать
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditRecord(null);
          setModalVisible(true);
        }}
      >
        Создать новую сделку +
      </Button>
      <Table dataSource={deals} columns={columns} rowKey="id" />
      <DealFormModal
        visible={modalVisible}
        onCreate={handleCreateDeal}
        onCancel={() => setModalVisible(false)}
        initialValues={editRecord}
      />
    </div>
  );
};

export default DealsList;