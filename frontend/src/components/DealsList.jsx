import React, { useEffect, useState } from 'react';
import { Table, Button, notification, DatePicker } from 'antd';
import dealService from '../services/dealService';
import refService from '../services/refService';
import DealCreate from './DealForm';
import DealEdit from './DealEdit';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(isBetween);
dayjs.extend(advancedFormat);
dayjs.locale('ru');

const { RangePicker } = DatePicker;

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

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY/MM');
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
      setDeals(data.map((record, index) => ({...record, dealNumber: index+1})));
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
      render: (_, __, index) => index + 1,
      sorter: (a, b) => Number(a.dealNumber) - Number(b.dealNumber)
    },
    {
      title: 'Дата', // Date
      dataIndex: 'date',
      key: 'date',
      render: (text) => dayjs(text).format('YYYY/MM'), // Format to "YYYY/MM"
      sorter: (a, b) => dayjs(a.date).diff(dayjs(b.date)), // Sort by date
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            picker="month" // Month picker
            onChange={(dates, dateStrings) => {
              setSelectedKeys(dateStrings && dateStrings.length === 2 ? [dateStrings] : []); // Set selected range
            }}
            value={
              selectedKeys[0]
                ? [dayjs(selectedKeys[0][0], 'YYYY-MM'), dayjs(selectedKeys[0][1], 'YYYY-MM')]
                : null
            } // Bind selected values to RangePicker
            style={{ marginBottom: 8, display: 'block' }}
          />
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => confirm()}
              style={{
                marginRight: 8,
                padding: '4px 8px',
                background: '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
              }}
            >
              Применить
            </button>
            <button
              type="button"
              onClick={clearFilters}
              style={{
                padding: '4px 8px',
                background: '#f5222d',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
              }}
            >
              Сбросить
            </button>
          </div>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value || value.length !== 2) return true; // Skip filtering if range is not selected
        const recordDate = dayjs(record.date, 'YYYY/MM');
        const startDate = dayjs(value[0], 'YYYY/MM');
        const endDate = dayjs(value[1], 'YYYY/MM');
        return recordDate.isBetween(startDate, endDate, 'month', '[]'); // Check if within range
      },
    },
    { title: 'Завод', dataIndex: 'factory', key: 'factory' },
    { title: 'Вид ГСМ', dataIndex: 'fuelType', key: 'fuelType' },
    { title: 'Поставщик', dataIndex: ['Supplier', 'name'], key: 'supplierName'},
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
    {
      title: 'Сумма налива', // Supplier Amount
      key: 'supplierAmount1',
      render: (record) => {
          // Calculate total supplier amount (Сумма налива)
          const totalSupplierAmount = record.Supplier?.Prices?.reduce((total, price, index) => {
              const tonn = record.Supplier.Tonns?.[index]?.tonn;
              const amount = tonn ? Number(price.price) * Number(tonn.replace(',', '.')) : 0;
              return total + amount;
          }, 0) || 0;
  
          return (
              <div style={{ padding: '0' }}>
                  {totalSupplierAmount.toFixed(2)} {/* Display final amount with 2 decimal places */}
              </div>
          );
      }
    },
    {
      title: 'Оплата поставщик', // Supplier Payment
      key: 'paymentSuppTotal',
      render: (record) => {
          // Calculate total supplier payments
          const totalPayment = record.Supplier?.Payments?.reduce((total, payment) => {
              return total + (payment.payment || 0);
          }, 0) || 0;
  
          return (
              <div style={{ padding: '0' }}>
                  {totalPayment.toFixed(2)} {/* Display total payment with 2 decimal places */}
              </div>
          );
      }
    },
    {
      title: 'ДТ/КТ', // Final Amount
      key: 'finalAmount',
      render: (record) => {
          // Calculate total supplier amount
          const totalSupplierAmount = record.Supplier?.Prices?.reduce((total, price, index) => {
            const tonn = record.Supplier.Tonns?.[index]?.tonn || 0; // Handle undefined Tonn
            const priceValue = price.price || (Number(price.quotation) - Number(price.discount)) || 0;
            const amount = tonn ? Number(tonn.replace(',', '.')) * priceValue : 0;
            return total + amount;
          }, 0) || 0;
  
          // Calculate total payments (Платежи), defaulting to 0 if Payments is null or empty
          const totalPayments = (record.Supplier?.Payments?.length > 0)
              ? record.Supplier?.Payments?.reduce((total, payment) => total + (payment.payment || 0), 0)
              : 0;
  
          // Calculate final amount
          const finalAmount = totalSupplierAmount - totalPayments;
  
          return (
              <div style={{ padding: '0' }}>
                  {finalAmount.toFixed(2)} {/* Display final amount with 2 decimal places */}
              </div>
          );
      }
    },
    {
      title: 'Группа компании 1', // First name column
      key: 'companyGroupName1',
      dataIndex: ['CompanyGroup', 'names'],
      render: (text) => {
        const names = text ? text.split(',') : [];
        return names[0] || ''; // Render the first name
      },
    },
    {
      title: 'Группа компании 2', // First name column
      key: 'companyGroupName2',
      dataIndex: ['CompanyGroup', 'names'],
      render: (text) => {
        const names = text ? text.split(',') : [];
        return names[1] || ''; // Render the first name
      },
    },
    {title: 'Покупатель', dataIndex: ['Buyer', 'name'], key: 'supplierName'},
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
      title: 'Отгружено на сумму', // Buyer Amount
      key: 'buyerAmount1',
      render: (record) => {
          // Calculate total buyer amount (Сумма налива)
          const totalBuyerAmount = record.Buyer?.Prices?.reduce((total, price, index) => {
              const tonn = record.Buyer.Tonns?.[index]?.tonn;
              const amount = tonn ? Number(price.price) * Number(tonn.replace(',', '.')) : 0;
              return total + amount;
          }, 0) || 0;
  
          return (
              <div style={{ padding: '0' }}>
                  {totalBuyerAmount.toFixed(2)} {/* Display final amount with 2 decimal places */}
              </div>
          );
      }
    },
    {
      title: 'Оплата поставщик', // Supplier Payment
      key: 'paymentSuppTotal1',
      render: (record) => {
          // Calculate total supplier payments
          const totalPayment = record.Buyer?.Payments?.reduce((total, payment) => {
              return total + (payment.payment || 0);
          }, 0) || 0;
  
          return (
              <div style={{ padding: '0' }}>
                  {totalPayment.toFixed(2)} {/* Display total payment with 2 decimal places */}
              </div>
          );
      }
    },
    {
      title: 'ДТ/КТ', // Final Amount
      key: 'finalAmount5',
      render: (record) => {
          // Calculate total supplier amount
          const totalSupplierAmount = record.Buyer?.Prices?.reduce((total, price, index) => {
            const tonn = record.Buyer.Tonns?.[index]?.tonn || 0; // Handle undefined Tonn
            const priceValue = price.price || (Number(price.quotation) - Number(price.discount)) || 0;
            const amount = tonn ? Number(tonn.replace(',', '.')) * priceValue : 0;
            return total + amount;
          }, 0) || 0;
  
          // Calculate total payments (Платежи), defaulting to 0 if Payments is null or empty
          const totalPayments = (record.Buyer?.Payments?.length > 0)
              ? record.Buyer?.Payments?.reduce((total, payment) => total + (payment.payment || 0), 0)
              : 0;
  
          // Calculate final amount
          const finalAmount = totalSupplierAmount - totalPayments;
  
          return (
              <div style={{ padding: '0' }}>
                  {finalAmount.toFixed(2)} {/* Display final amount with 2 decimal places */}
              </div>
          );
      }
    },
    // {
    //   title: 'Статус',
    //   key: 'status',
    //   render: (text, record) => getStatus(record),
    //   filters: [
    //     { text: 'Налив', value: 'Налив' },
    //     { text: 'В пути', value: 'В пути' },
    //     { text: 'Новый', value: 'Новый' }
    //   ],
    //   onFilter: (value, record) => getStatus(record) === value
    // },
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