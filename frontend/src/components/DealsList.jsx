import React, { useEffect, useState } from 'react';
import { Table, Button, notification } from 'antd';
import dealService from '../services/dealService';
import DealCreate from './DealForm';
import DealEdit from './DealEdit';


const getStatus = (record) => {
  if (record.Supplier) {
    if (record.Buyer) {
      return "Налив";
    } else {
      return "В пути";
    }
  }
  return "Новый";
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${year}`;
};

const DealsList = () => {
  const [deals, setDeals] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModal, setEditModal] = useState(false)
  const [editRecord, setEditRecord] = useState(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const onCreate = async (values) => {
    try {
      await dealService.createDeal(values);
      await fetchDeals();
      notification.success({ message: 'Сделка успешно сохранена!' });
    } catch (error) {
      notification.error({ message: 'Не удалось сохранить сделку!' });
    } finally {
      setModalVisible(false);
    }
  };

  const onUpdate = async (values) => {
    try {
      console.log(values)
      await dealService.updateDeal(values)
      await fetchDeals();
      notification.success({ message: 'Сделка успешно сохранена!' });
    } catch (error) {
      notification.error({ message: 'Не удалось сохранить сделку!' });
    } finally {
      setEditModal(false);
    }
  }

  const fetchDeals = async () => {
    try {
      const { data } = await dealService.getDeals();
      console.log("DATA: ", data)
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
    // { title: 'Дата', dataIndex: 'date', key: 'date', 
    //   render: (text) => formatDate(text), 
    //   sorter: (a, b) => new Date(a.date) - new Date(b.date) 
    // },
    { title: 'Завод', dataIndex: 'factory', key: 'factory' },
    { title: 'Вид ГСМ', dataIndex: 'fuelType', key: 'fuelType' },
    { title: 'Тоннаж Налива', dataIndex: ['Supplier', 'fillTon'], key: 'fillTonSupp' },
    { title: 'Тоннаж Отгрузки', dataIndex: ['Buyer', 'fillTon'], key: 'fillTonBuyer' },
    {
      title: 'Статус',
      key: 'status',
      render: (text, record) => getStatus(record),
      filters: [
        { text: 'Налив', value: 'Налив' },
        { text: 'В пути', value: 'В пути' },
        { text: 'Новый', value: 'Новый' }
      ],
      onFilter: (value, record) => getStatus(record) === value
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (record) => (
        <Button
          type="link"
          onClick={() => {
            setEditRecord(record);
            setEditModal(true);
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
      <Table dataSource={deals} columns={columns} />
      <DealCreate
        visible={modalVisible}
        onCreate={onCreate}
        onCancel={() => setModalVisible(false)}
      />
      <DealEdit
        visible={editModal}
        onCreate={onUpdate}
        onCancel={() => setEditModal(false)}
        initialValues={editRecord}
      />
    </div>
  );
};

export default DealsList;