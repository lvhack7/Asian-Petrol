import React, { useEffect, useState } from 'react';
import { Table, Button, notification } from 'antd';
import dealService from '../services/dealService';
import refService from '../services/refService';
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
  const [loading, setLoading] = useState(false)
  const [mapping, setMapping] = useState({})

  useEffect(() => {
    fetchColors();
    fetchDeals();
  }, []);

  useEffect(() => {
    const styleTag = document.createElement('style');
    let styles = '';
    Object.keys(mapping).forEach((fuelType) => {
      const color = mapping[fuelType];
      styles += `.row-${fuelType} { background-color: ${color} !important; }\n`;
    });
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    // Cleanup: Remove the style tag on unmount
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [mapping]);

  const onCreate = async (values) => {
    try {
      console.log(values)
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
    setLoading(true)
    try {
      const { data } = await dealService.getDeals();
      console.log("DATA: ", data)
      setDeals(data);
    } catch (error) {
      localStorage.removeItem('token');
      notification.error({ message: 'Не удалось получить сделки!' });
    } finally {
      setLoading(false);
    }
  };

  const fetchColors = async () => {
    setLoading(true);
    try {
      const response = await refService.getRef("fuleType"); // Assuming `refService` is correctly defined
      console.log(response.data)
      const colorDictionary = response.data.reduce((acc, item) => {
        acc[item.name] = item.color;
        return acc;
      }, {});
      setMapping(colorDictionary)
    } catch (error) {
      notification.error({ message: 'Не удалось получить сделки!' });
    } finally {
      setLoading(false);
    }
  };

  const deleteDeal = async (id) => {
    try {
      await dealService.deleteDeal(id)
      await fetchDeals();
      notification.success({ message: 'Сделка успешно удалена!' });
    } catch(e) {
      notification.error({ message: 'Не удалось удалить сделку!' });
    }
  }

  const columns = [
    {
      title: 'Тип', // Type
      dataIndex: 'type',
      key: 'type',
      render: (text) => text || '',
    },
    { title: '# Сделки', dataIndex: 'dealNumber', key: 'dealNumber',
      sorter: (a, b) => Number(a.dealNumber) - Number(b.dealNumber)
    },
    // { title: 'Дата', dataIndex: 'date', key: 'date', 
    //   render: (text) => formatDate(text), 
    //   sorter: (a, b) => new Date(a.date) - new Date(b.date) 
    // },
    { title: 'Завод', dataIndex: 'factory', key: 'factory' },
    { title: 'Вид ГСМ', dataIndex: 'fuelType', key: 'fuelType' },
    { title: 'Тоннаж Налива', key: 'fillTonns', 
      render: (record) => {
        // Helper function to clean and parse numbers
        const parseTonn = (tonn) => {
          if (!tonn) return 0;
          // Remove spaces and replace commas with dots
          const cleanedTonn = tonn.replace(/\s/g, '').replace(',', '.');
          return parseFloat(cleanedTonn) || 0;
        };
      
        // Calculate the total sum of tonn values
        const totalTonn = record.Supplier && record.Supplier.Tonns
          ? record.Supplier.Tonns.reduce((sum, tonn) => sum + parseTonn(tonn.tonn), 0)
          : 0;
      
        return (
          <strong>{totalTonn.toFixed(2)}</strong>
        );
      }
    },
    { title: 'Тоннаж Отгрузки', key: 'fillTonns1',
      render: (record) => {
        // Helper function to clean and parse numbers
        const parseTonn = (tonn) => {
          if (!tonn) return 0;
          // Remove spaces and replace commas with dots
          const cleanedTonn = tonn.replace(/\s/g, '').replace(',', '.');
          return parseFloat(cleanedTonn) || 0;
        };
      
        // Calculate the total sum of tonn values
        const totalTonn = record.Buyer && record.Buyer.Tonns
          ? record.Buyer.Tonns.reduce((sum, tonn) => sum + parseTonn(tonn.tonn), 0)
          : 0;
      
        return (
          <strong>{totalTonn.toFixed(2)}</strong>
        );
      }
     },
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
        <div className='flex items-center space-x-1'>
          <Button
          type="link"
          onClick={() => {
            setEditRecord(record);
            setEditModal(true);
          }}
        >
          Редактировать
        </Button>
        <Button
          type="link"
          onClick={() => deleteDeal(record.id)}
        >
          Удалить
        </Button>
        </div>
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
      <Table 
        className='mt-4' 
        dataSource={deals} 
        columns={columns} 
        loading={loading} 
        rowClassName={(record) => `row-${record.fuelType}`}
      />
      <DealCreate
        visible={modalVisible}
        onCreate={onCreate}
        onCancel={() => setModalVisible(false)}
      />
      <DealEdit
        visible={editModal}
        onCreate={onUpdate}
        onCancel={() => {
          setEditRecord(null)
          setEditModal(false)
        }}
        initialValues={editRecord}
      />
    </div>
  );
};

export default DealsList;