import React, { useEffect, useState, useRef } from 'react'
import dealService from '../services/dealService'
import { Table, notification, Typography, Button, message } from 'antd';
import refService from '../services/refService';
import * as XLSX from 'xlsx-js-style';
import { color686868Cols, color87ceebCols, colorFFD580Cols } from '../utils';


const {Text} = Typography

function formatNumber(number) {
  if (!number) return '';

  // Check if the input is a string and can be parsed into a valid number
  const num = typeof number === 'string' ? parseFloat(number.replace(',', '.').replace(/\s/g, '')) : number;

  // If not a valid number, return an empty string
  if (isNaN(num)) return number;

  return num.toLocaleString('ru-RU', {
    minimumFractionDigits: 0
  }).replace(/\s/g, ' ').replace(',', '.'); // Ensures space separator for thousands
}


const KZPassport = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapping, setMapping] = useState({})

  const [fuel, setFuel] = useState([])
  const [factories, setFactories] = useState([])
  const [supplier, setSupplier] = useState([])
  const [buyer, setBuyer] = useState([])
  const [companyGroup, setCompanyGroup] = useState([])
  const [basis, setBasis] = useState([])
  const [condition, setCondition] = useState([])
  const [currency, setCurrency] = useState([])
  const [destination, setDestination] = useState([])

  const tableRef = useRef(null);

  useEffect(() => {
    fetchColors()
    fetchDeals();
    fetchRefs();
  }, []);

  useEffect(() => {
    const styleTag = document.createElement('style');
    let styles = '';
    Object.keys(mapping).forEach((fuelType) => {
      const color = mapping[fuelType];
      styles += `.row1-${fuelType} { background-color: ${color} !important; }\n`;
    });
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    // Cleanup: Remove the style tag on unmount
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [mapping]);

  const fetchColors = async () => {
    try {
      const response = await refService.getRef("fuleType"); // Assuming `refService` is correctly defined
      const colorDictionary = response.data.reduce((acc, item) => {
        acc[item.name] = item.color;
        return acc;
      }, {});
      setMapping(colorDictionary)
    } catch (error) {
      message.error('Failed to fetch items');
    }
  };

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const { data } = await dealService.getDeals();
      setDeals(
        data
          .map((record, index) => ({ ...record, dealNumber: index + 1 }))
          .filter((deal) => deal.type === 'KZ')
      );
    } catch (error) {
      localStorage.removeItem('token');
      notification.error({ message: 'Не удалось получить сделки!' });
    } finally {
      setLoading(false);
    }
  };

  const fetchRefs = async () => {
      try {
        const fetchFuel = await refService.getRef("fuleType")
        const fetchFact = await refService.getRef("factory")
        const fetchSupplier = await refService.getRef("supplier")
        const fetchBuyer = await refService.getRef("buyer")
        const fetchCompanyGroup = await refService.getRef("companyGroup")
        const fetchBasis = await refService.getRef("deliveryBasis")
        const fetchCondition = await refService.getRef("fixationCondition")
        const fetchCurrency = await refService.getRef("currency")
        const fetchDestination = await refService.getRef("destinationStation")
  
        setFuel(fetchFuel.data)
        setFactories(fetchFact.data)
        setSupplier(fetchSupplier.data)
        setBuyer(fetchBuyer.data)
        setCompanyGroup(fetchCompanyGroup.data)
        setBasis(fetchBasis.data)
        setCondition(fetchCondition.data)
        setCurrency(fetchCurrency.data)
        setDestination(fetchDestination.data)
      } catch(e) {
        console.log(e)
      }
    }
  
  
  const columns = [
      {
          title: <div className='text-blue-400 font-bold'>Тип</div>, // Type
          dataIndex: 'type',
          key: 'type',
          render: (text) => text || '',
      },
      {
        title: <div className='text-blue-400 font-bold'>Номер сделки</div>, // Deal Number
        dataIndex: 'dealNumber',
        key: 'dealNumber',
        render: (text) => text || '',
      },
      {
        title: <div className='text-blue-400 font-bold'>Дата</div>, // Date
        dataIndex: 'date',
        key: 'date',
        render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
          month: "2-digit",
          year: "numeric"
        }).replace(/\./g, "/")}</Text> : ''),
      },
      {
        title: <div className='text-blue-400 font-bold'>Завод</div>, // Factory
        dataIndex: 'factory',
        key: 'factory',
        filters: factories.map(factory => ({ text: factory.name, value: factory.name })),
        onFilter: (value, record) => record.factory === value,
        render: (text) => text || '',
      },
      {
        title: <div className='text-blue-400 font-bold'>Вид ГСМ</div>, // Factory
        dataIndex: 'fuelType',
        key: 'fuelType',
        filters: fuel.map(fuel => ({ text: fuel.name, value: fuel.name })),
        onFilter: (value, record) => record.fuelType === value,
        render: (text) => text || ''
      },
      {
        title: <div className='text-blue-400 font-bold'>% Серы</div>, // Sulfur Content
        dataIndex: 'sulfur',
        key: 'sulfur',
        render: (text) => text || '',
      },
      {
        title: <div className='text-orange-400 font-bold'>Поставщик</div>, // Supplier Name
        dataIndex: ['Supplier', 'name'],
        key: 'supplierName',
        filters: supplier.map(supplier => ({ text: supplier.name, value: supplier.name })),
        onFilter: (value, record) => record.Supplier.name === value,
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            № договор / приложение
          </div>
        ),
        dataIndex: ['Supplier', 'contractNumber'],
        key: 'supplierContractNumber',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Законтрактовано по приложению
          </div>
        ),
        dataIndex: ['Supplier', 'volume'],
        key: 'supplierVolume',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Сумма по приложению
          </div>
        ),
        dataIndex: ['Supplier', 'amount'],
        key: 'supplierAmount',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Базис поставки
          </div>
        ),
        dataIndex: ['Supplier', 'deliveryBasis'],
        key: 'deliveryBasis',
        filters: basis.map((item) => ({ text: item.name, value: item.name })),
        onFilter: (value, record) =>
          record.Supplier.deliveryBasis === value,
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Условия фиксации
          </div>
        ),
        dataIndex: ['Supplier', 'fixationCondition'],
        key: 'fixationCondition',
        filters: condition.map((item) => ({ text: item.name, value: item.name })),
        onFilter: (value, record) =>
          record.Supplier.fixationCondition === value,
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Цены покупки
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-orange-400 font-bold">Валюта</div>
            ),
            key: 'currency',
            render: (record) => {
              const lines = (record.Supplier?.Prices || []).map(
                (price) => price.currency || 'Пусто'
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <><br /><span style={{
                        display: 'inline-block',
                        fontSize: 0,
                        lineHeight: 0,
                        overflow: 'hidden',
                        color: 'transparent',
                        verticalAlign: 'middle',
                      }}>//</span></>}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">Коммент</div>
            ),
            key: 'commentary',
            render: (record) => {
              const lines = (record.Supplier?.Prices || []).map(
                (price) => price.commentary ?? 'Пусто'
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <><br /><span style={{
                        display: 'inline-block',
                        fontSize: 0,
                        lineHeight: 0,
                        overflow: 'hidden',
                        color: 'transparent',
                        verticalAlign: 'middle',
                      }}>//</span></>}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">Котировка</div>
            ),
            key: 'quotation',
            render: (record) => {
              const lines = (record.Supplier?.Prices || []).map(
                (price) => price.quotation ?? 'Пусто'
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <><br /><span style={{
                        display: 'inline-block',
                        fontSize: 0,
                        lineHeight: 0,
                        overflow: 'hidden',
                        color: 'transparent',
                        verticalAlign: 'middle',
                      }}>//</span></>}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">Скидка</div>
            ),
            key: 'discount',
            render: (record) => {
              const lines = (record.Supplier?.Prices || []).map(
                (price) => price.discount ?? 'Пусто'
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <><br /><span style={{
                        display: 'inline-block',
                        fontSize: 0,
                        lineHeight: 0,
                        overflow: 'hidden',
                        color: 'transparent',
                        verticalAlign: 'middle',
                      }}>//</span></>}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">Цена</div>
            ),
            key: 'price',
            render: (record) => {
              const lines = (record.Supplier?.Prices || []).map((price) => {
                if (price.price != null) {
                  return price.price;
                }
                const q = Number(price.quotation) || 0;
                const d = Number(price.discount) || 0;
                return q - d;
              });
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <><br /><span style={{
                        display: 'inline-block',
                        fontSize: 0,
                        lineHeight: 0,
                        overflow: 'hidden',
                        color: 'transparent',
                        verticalAlign: 'middle',
                      }}>//</span></>}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
        ],
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Налив поставщик
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-orange-400 font-bold">
                Тонн
              </div>
            ),
            key: 'buyTonn',
            render: (record) => {
              const lines = (record.Supplier?.Tonns || []).map(
                (tonn) => tonn.tonn || ''
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <><br /><span style={{
                        display: 'inline-block',
                        fontSize: 0,
                        lineHeight: 0,
                        overflow: 'hidden',
                        color: 'transparent',
                        verticalAlign: 'middle',
                      }}>//</span></>}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">
                Дата
              </div>
            ),
            key: 'buyDate',
            render: (record) => {
              const lines = (record.Supplier?.Tonns || []).map(
                (tonn) => (tonn.date ? new Date(tonn.date).toLocaleDateString() : '')
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <><br /><span style={{
                        display: 'inline-block',
                        fontSize: 0,
                        lineHeight: 0,
                        overflow: 'hidden',
                        color: 'transparent',
                        verticalAlign: 'middle',
                      }}>//</span></>}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
        ],
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Сумма налива
          </div>
        ),
        key: 'supplierAmount1',
        render: (record) => {
          const lines = (record.Supplier?.Prices || []).map((price, index) => {
            const tonn = record.Supplier?.Tonns?.[index]?.tonn;
            const priceValue = Number(price.price) || 0;
            const tonnValue = tonn ? Number(tonn.replace(',', '.')) : 0;
            const amount = priceValue * tonnValue;
            return amount.toFixed(2);
          });
          return (
            <div style={{ whiteSpace: 'pre-wrap', padding: 0 }}>
              {lines.join('\n')}
            </div>
          );
        },
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Оплата поставщик
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-orange-400 font-bold">
                Сумма
              </div>
            ),
            key: 'paymentSupp',
            render: (record) => {
              const lines = (record.Supplier?.Payments || []).map(
                (p) => (p.payment != null ? p.payment.toString() : '')
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <><br /><span style={{
                        display: 'inline-block',
                        fontSize: 0,
                        lineHeight: 0,
                        overflow: 'hidden',
                        color: 'transparent',
                        verticalAlign: 'middle',
                      }}>//</span></>}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">
                Дата оплаты
              </div>
            ),
            key: 'suppDate',
            render: (record) => {
              const lines = (record.Supplier?.Payments || []).map(
                (p) => (p.date ? new Date(p.date).toLocaleDateString() : '')
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <><br /><span style={{
                        display: 'inline-block',
                        fontSize: 0,
                        lineHeight: 0,
                        overflow: 'hidden',
                        color: 'transparent',
                        verticalAlign: 'middle',
                      }}>//</span></>}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
        ],
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            ДТ/КТ (Поставщик)
          </div>
        ),
        key: 'finalAmount',
        render: (record) => {
          const totalSupplierAmount = record.Supplier?.Prices?.reduce((total, price, index) => {
            const tonn = record.Supplier.Tonns?.[index]?.tonn || 0;
            const priceValue = price.price || (Number(price.quotation) - Number(price.discount)) || 0;
            const amount = tonn ? Number(tonn.replace(',', '.')) * priceValue : 0;
            return total + amount;
          }, 0) || 0;
    
          const totalPayments = record.Supplier?.Payments?.length > 0
            ? record.Supplier.Payments.reduce((total, payment) => total + (payment.payment || 0), 0)
            : 0;
    
          const finalAmount = totalSupplierAmount - totalPayments;
          return <div style={{ padding: 0 }}>{finalAmount.toFixed(2)}</div>;
        },
      },
      {
        title: (
          <div className="text-blue-600 font-bold">
            Группа компании 1
          </div>
        ),
        key: 'companyGroupName1',
        dataIndex: ['CompanyGroup', 'names'],
        filters: companyGroup.map(company => ({ text: company.name, value: company.name })),
        onFilter: (value, record) => {
          const names = record.CompanyGroup.names ? record.CompanyGroup.names.split(',') : [];
          return names[0] === value;
        },
        render: (text) => {
          const names = text ? text.split(',') : [];
          return names[0] || '';
        },
      },
      {
        title: (
          <div className="text-blue-600 font-bold">
            Цена
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-blue-600 font-bold">
                Валюта
              </div>
            ),
            key: 'currency',
            render: (record) => {
              const lines = (record.CompanyGroup?.Prices || []).map(
                (price) => price.currency || 'Пусто'
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: 0,
                              lineHeight: 0,
                              overflow: 'hidden',
                              color: 'transparent',
                              verticalAlign: 'middle',
                            }}
                          >
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-blue-600 font-bold">
                Коммент
              </div>
            ),
            key: 'commentary',
            render: (record) => {
              const lines = (record.CompanyGroup?.Prices || []).map(
                (price) => price.commentary ?? 'Пусто'
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: 0,
                              lineHeight: 0,
                              overflow: 'hidden',
                              color: 'transparent',
                              verticalAlign: 'middle',
                            }}
                          >
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-blue-600 font-bold">
                Котировка
              </div>
            ),
            key: 'quotation',
            render: (record) => {
              const lines = (record.CompanyGroup?.Prices || []).map(
                (price) => price.quotation ?? 'Пусто'
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: 0,
                              lineHeight: 0,
                              overflow: 'hidden',
                              color: 'transparent',
                              verticalAlign: 'middle',
                            }}
                          >
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-blue-600 font-bold">
                Скидка
              </div>
            ),
            key: 'discount',
            render: (record) => {
              const lines = (record.CompanyGroup?.Prices || []).map(
                (price) => price.discount ?? 'Пусто'
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: 0,
                              lineHeight: 0,
                              overflow: 'hidden',
                              color: 'transparent',
                              verticalAlign: 'middle',
                            }}
                          >
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-blue-600 font-bold">
                Цена
              </div>
            ),
            key: 'price',
            render: (record) => {
              const lines = (record.CompanyGroup?.Prices || []).map((price) => {
                if (price.price != null) {
                  return price.price;
                }
                const q = Number(price.quotation) || 0;
                const d = Number(price.discount) || 0;
                return q - d;
              });
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: 0,
                              lineHeight: 0,
                              overflow: 'hidden',
                              color: 'transparent',
                              verticalAlign: 'middle',
                            }}
                          >
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
        ],
      },
      {
        title: (
          <div className="text-blue-600 font-bold">
            Группа компании 2
          </div>
        ), // Second name column
        key: 'companyGroupName2',
        dataIndex: ['CompanyGroup', 'names'],
        filters: companyGroup.map(company => ({ text: company.name, value: company.name })),
        onFilter: (value, record) => {
          const names = record.CompanyGroup.names ? record.CompanyGroup.names.split(',') : [];
          return names[1] === value;
        },
        render: (text) => {
          const names = text ? text.split(',') : [];
          return names[1] || ''; // Render the second name (if it exists)
        },
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Покупатель
          </div>
        ),
        dataIndex: ['Buyer', 'name'],
        key: 'buyerName',
        filters: buyer.map(buyer => ({ text: buyer.name, value: buyer.name })),
        onFilter: (value, record) => record.Buyer.name === value,
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Номер контракта покупателя
          </div>
        ),
        dataIndex: ['Buyer', 'contractNumber'],
        key: 'buyerContractNumber',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Объем покупателя
          </div>
        ),
        dataIndex: ['Buyer', 'volume'],
        key: 'buyerVolume',
        render: (text) => formatNumber(text),
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Законтракт. на сумму
          </div>
        ),
        key: 'buyerAmount',
        render: (record) => formatNumber(Number(record?.Buyer?.Prices[0]?.price) * Number(record?.Buyer?.volume)),
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Базис поставки
          </div>
        ),
        dataIndex: ['Buyer', 'deliveryBasis'],
        key: 'deliveryBasis',
        filters: basis.map(b => ({ text: b.name, value: b.name })),
        onFilter: (value, record) => record.Buyer.deliveryBasis === value,
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Станция назначения
          </div>
        ),
        dataIndex: ['Buyer', 'destinationStation'],
        key: 'destinationStation',
        filters: destination.map(d => ({ text: d.name, value: d.name })),
        onFilter: (value, record) => record.Buyer.destinationStation === value,
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Условия фиксации
          </div>
        ),
        dataIndex: ['Buyer', 'fixationCondition'],
        key: 'buyerFixationCondition',
        filters: condition.map(cond => ({ text: cond.name, value: cond.name })),
        onFilter: (value, record) => record.Buyer.fixationCondition === value,
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Цена продажи
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-orange-400 font-bold">
                Валюта
              </div>
            ),
            key: 'currency',
            render: (record) => {
              const lines = (record.Buyer?.Prices || []).map(price => price.currency || 'Пусто');
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span style={{
                            display: 'inline-block',
                            fontSize: 0,
                            lineHeight: 0,
                            overflow: 'hidden',
                            color: 'transparent',
                            verticalAlign: 'middle',
                          }}>
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">
                Коммент
              </div>
            ),
            key: 'commentary',
            render: (record) => {
              const lines = (record.Buyer?.Prices || []).map(price => price.commentary ?? 'Пусто');
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span style={{
                            display: 'inline-block',
                            fontSize: 0,
                            lineHeight: 0,
                            overflow: 'hidden',
                            color: 'transparent',
                            verticalAlign: 'middle',
                          }}>
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">
                Котировка
              </div>
            ),
            key: 'quotation',
            render: (record) => {
              const lines = (record.Buyer?.Prices || []).map(price => price.quotation ?? 'Пусто');
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span style={{
                            display: 'inline-block',
                            fontSize: 0,
                            lineHeight: 0,
                            overflow: 'hidden',
                            color: 'transparent',
                            verticalAlign: 'middle',
                          }}>
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">
                Скидка
              </div>
            ),
            key: 'discount',
            render: (record) => {
              const lines = (record.Buyer?.Prices || []).map(price => price.discount ?? 'Пусто');
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span style={{
                            display: 'inline-block',
                            fontSize: 0,
                            lineHeight: 0,
                            overflow: 'hidden',
                            color: 'transparent',
                            verticalAlign: 'middle',
                          }}>
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">
                Цена
              </div>
            ),
            key: 'price',
            render: (record) => {
              const lines = (record.Buyer?.Prices || []).map(price => {
                if (price.price != null) {
                  return price.price;
                }
                const q = Number(price.quotation) || 0;
                const d = Number(price.discount) || 0;
                return q - d;
              });
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span style={{
                            display: 'inline-block',
                            fontSize: 0,
                            lineHeight: 0,
                            overflow: 'hidden',
                            color: 'transparent',
                            verticalAlign: 'middle',
                          }}>
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
        ],
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Заявленный объем
          </div>
        ),
        dataIndex: ['Buyer', 'declared'],
        key: 'declaredVolume',
        render: (text) => formatNumber(text),
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Отгрузка покупателя
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-orange-400 font-bold">
                Тонн
              </div>
            ),
            key: 'buyTonn',
            render: (record) => {
              const lines = (record.Buyer?.Tonns || []).map(tonn => tonn.tonn || '');
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span style={{
                            display: 'inline-block',
                            fontSize: 0,
                            lineHeight: 0,
                            overflow: 'hidden',
                            color: 'transparent',
                            verticalAlign: 'middle',
                          }}>
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">
                Дата
              </div>
            ),
            key: 'buyDate',
            render: (record) => {
              const lines = (record.Buyer?.Tonns || []).map(tonn =>
                tonn.date ? new Date(tonn.date).toLocaleDateString() : ''
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span style={{
                            display: 'inline-block',
                            fontSize: 0,
                            lineHeight: 0,
                            overflow: 'hidden',
                            color: 'transparent',
                            verticalAlign: 'middle',
                          }}>
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
        ],
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Отгружено на сумму
          </div>
        ),
        key: 'buyerAmount6',
        render: (record) => {
          const lines = (record.Buyer?.Prices || []).map((price, index) => {
            const tonn = record.Buyer?.Tonns?.[index]?.tonn;
            const priceValue = Number(price.price) || 0;
            const tonnValue = tonn ? Number(tonn.replace(',', '.')) : 0;
            const amount = priceValue * tonnValue;
            return amount.toFixed(2);
          });
          return (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {lines.join('\n')}
            </div>
          );
        },
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            Оплата покупатель
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-orange-400 font-bold">
                Сумма
              </div>
            ),
            key: 'paymentSupp',
            render: (record) => {
              const lines = (record.Buyer?.Payments || []).map(p =>
                p.payment != null ? p.payment.toString() : ''
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span style={{
                            display: 'inline-block',
                            fontSize: 0,
                            lineHeight: 0,
                            overflow: 'hidden',
                            color: 'transparent',
                            verticalAlign: 'middle',
                          }}>
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
          {
            title: (
              <div className="text-orange-400 font-bold">
                Дата оплаты
              </div>
            ),
            key: 'suppDate',
            render: (record) => {
              const lines = (record.Buyer?.Payments || []).map(p =>
                p.date ? new Date(p.date).toLocaleDateString() : ''
              );
              return (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && (
                        <>
                          <br />
                          <span style={{
                            display: 'inline-block',
                            fontSize: 0,
                            lineHeight: 0,
                            overflow: 'hidden',
                            color: 'transparent',
                            verticalAlign: 'middle',
                          }}>
                            //
                          </span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            },
          },
        ],
      },
      {
        title: (
          <div className="text-orange-400 font-bold">
            ДТ/КТ (Покупатель)
          </div>
        ),
        key: 'finalAmount',
        render: (record) => {
          const totalSupplierAmount = record.Buyer?.Prices?.reduce((total, price, index) => {
            const tonn = record.Buyer.Tonns?.[index]?.tonn || 0;
            const priceValue = price.price || (Number(price.quotation) - Number(price.discount)) || 0;
            const amount = tonn ? Number(tonn.replace(',', '.')) * priceValue : 0;
            return total + amount;
          }, 0) || 0;
    
          const totalPayments = record.Buyer?.Payments?.length > 0
            ? record.Buyer.Payments.reduce((total, payment) => total + (payment.payment || 0), 0)
            : 0;
    
          const finalAmount = totalSupplierAmount - totalPayments;
          return <div style={{ padding: 0 }}>{finalAmount.toFixed(2)}</div>;
        },
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Экспедитор
          </div>
        ),
        dataIndex: ['Forwarder', 'name'],
        key: 'forwarderName',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Компания группы
          </div>
        ),
        dataIndex: ['Forwarder', 'groupCompany'],
        key: 'groupCompany',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            ж/д тариф план
          </div>
        ),
        dataIndex: ['Forwarder', 'plannedRailwayTariff'],
        key: 'plannedRailwayTariff',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            ж/д тариф факт
          </div>
        ),
        dataIndex: ['Forwarder', 'actualRailwayTariff'],
        key: 'actualRailwayTariff',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Фактически отгруженный объем, МТ
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-gray-600 font-bold">
                Дата
              </div>
            ),
            dataIndex: ['Forwarder', 'actualShippedVolumeMTDate'],
            key: 'actualShippedVolumeMTDate',
            render: (text) =>
              text ? (
                <Text>
                  {new Date(text)
                    .toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
                    .replace(/\./g, '/')}
                </Text>
              ) : (
                ''
              ),
          },
          {
            title: (
              <div className="text-gray-600 font-bold">
                Значение
              </div>
            ),
            dataIndex: ['Forwarder', 'actualShippedVolumeMT'],
            key: 'actualShippedVolumeMT',
          },
        ],
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Факт. объем по счету-фактуре, МТ
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-gray-600 font-bold">
                Дата
              </div>
            ),
            dataIndex: ['Forwarder', 'actualVolumeInvoiceMTDate'],
            key: 'actualVolumeInvoiceMTDate',
            render: (text) =>
              text ? (
                <Text>
                  {new Date(text)
                    .toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
                    .replace(/\./g, '/')}
                </Text>
              ) : (
                ''
              ),
          },
          {
            title: (
              <div className="text-gray-600 font-bold">
                Значение
              </div>
            ),
            dataIndex: ['Forwarder', 'actualVolumeInvoiceMT'],
            key: 'actualVolumeInvoiceMT',
          },
        ],
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Сумма по счету-фактуре на фактич. объем
          </div>
        ),
        children: [
          {
            title: (
              <div className="text-gray-600 font-bold">
                Дата
              </div>
            ),
            dataIndex: ['Forwarder', 'invoiceAmountActualVolumeDate'],
            key: 'invoiceAmountActualVolumeDate',
            render: (text) =>
              text ? (
                <Text>
                  {new Date(text)
                    .toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
                    .replace(/\./g, '/')}
                </Text>
              ) : (
                ''
              ),
          },
          {
            title: (
              <div className="text-gray-600 font-bold">
                Значение
              </div>
            ),
            dataIndex: ['Forwarder', 'invoiceAmountActualVolume'],
            key: 'invoiceAmountActualVolume',
          },
        ],
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Охрана
          </div>
        ),
        dataIndex: ['Forwarder', 'security'],
        key: 'security',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Сверхнормативы (высокое)
          </div>
        ),
        dataIndex: ['Forwarder', 'excessHigh'],
        key: 'excessHigh',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Сверхнормативы (переведенное)
          </div>
        ),
        dataIndex: ['Forwarder', 'excessTransferred'],
        key: 'excessTransferred',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Штрафы (высокое)
          </div>
        ),
        dataIndex: ['Forwarder', 'penaltiesHigh'],
        key: 'penaltiesHigh',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Штрафы (переведенные)
          </div>
        ),
        dataIndex: ['Forwarder', 'penaltiesTransferred'],
        key: 'penaltiesTransferred',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Дополнительные расходы
          </div>
        ),
        dataIndex: ['Forwarder', 'additionalCosts'],
        key: 'additionalCosts',
        render: (text) => text || '',
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Заполненный объем
          </div>
        ),
        dataIndex: ['Forwarder', 'volumeFilled'],
        key: 'volumeFilled',
        render: (text) => formatNumber(text),
      },
      {
        title: (
          <div className="text-gray-600 font-bold">
            Дата загрузки
          </div>
        ),
        dataIndex: ['Forwarder', 'fillDate'],
        key: 'forwarderFillDate',
        render: (text) =>
          text ? (
            <Text>
              {new Date(text)
                .toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
                .replace(/\./g, '/')}
            </Text>
          ) : (
            ''
          ),
      },
      {
        title: <div className='text-gray-600 font-bold'>Перевыставлено на</div>, // Type
        dataIndex: ['Forwarder', 'reslisted'],
        key: 'relisted',
        render: (text) => text || '',
      },
  ]
  
  const handleExport = () => {
      if (!tableRef.current) {
        console.warn('No table container found');
        return;
      }
    
      const tableElem = tableRef.current.querySelector('table');
      if (!tableElem) {
        console.warn('No <table> element found inside container');
        return;
      }
    
      // a) Convert the table to a SheetJS worksheet
      const worksheet = XLSX.utils.table_to_sheet(tableElem);
    
      // Get the range of the worksheet (e.g., "A1:F20")
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const headerRow = range.s.r; // Typically the first row (row 0)
    
      // Loop over each column in the header row
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
        const cell = worksheet[cellAddress];
        if (!cell || typeof cell.v !== 'string') continue;
  
        const headerText = cell.v.trim();
        cell.s = cell.s || {};
  
        if (color87ceebCols.includes(headerText)) {
          cell.s.allignment = {
            wrapText: true
          }
          cell.s.font = {
            bold: true,
            sz: 12
          }
          cell.s.fill = {
            patternType: 'solid',
            fgColor: { rgb: 'A7C7E7' } // light blue
          };
        } else if (colorFFD580Cols.includes(headerText)) {
          cell.s.allignment = {
            wrapText: true
          }
          cell.s.font = {
            bold: true,
            sz: 12
          }
          cell.s.fill = {
            patternType: 'solid',
            fgColor: { rgb: 'FAC898' } // light orange
          };
        } else if (color686868Cols.includes(headerText)) {
          cell.s.allignment = {
            wrapText: true
          }
          cell.s.font = {
            bold: true,
            sz: 12
          }
          cell.s.fill = {
            patternType: 'solid',
            fgColor: { rgb: 'A9A9A9' } // gray
          };
        }
      }
    
      // Other modifications (e.g., replacing '//' with line breaks)
      Object.keys(worksheet).forEach((cellAddr) => {
        if (cellAddr[0] === '!') return;
        const cell = worksheet[cellAddr];
        if (typeof cell.v === 'string' && cell.v.includes('//')) {
          cell.v = cell.v.replace(/\/\/+/g, '\n');
          cell.s = cell.s || {};
          cell.s.alignment = cell.s.alignment || {};
          cell.s.alignment.wrapText = true;
        }
      });
    
      // Build a new workbook, add the worksheet, and trigger the download
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, 'passport-kz.xlsx');
    };

  return (
    <>
      <h2 className="font-semibold text-2xl mb-4">KZ Паспорт</h2>
      <div ref={tableRef}>
        <Table
          className="overflow-x-auto"
          columns={columns}
          dataSource={deals}
          rowKey="dealNumber"
          bordered
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowClassName={(record) => `row2-${record.fuelType}`}
        />
      </div>  
      <Button onClick={handleExport} className="mt-4">
        Экспорт в Excel
      </Button>
    </>
  );
};

export default KZPassport;