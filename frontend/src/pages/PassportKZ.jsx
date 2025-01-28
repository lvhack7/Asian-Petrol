import React, { useEffect, useState, useRef } from 'react'
import dealService from '../services/dealService'
import { Table, notification, Typography, Button, message } from 'antd';
import refService from '../services/refService';
import * as XLSX from 'xlsx';

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
        title: 'Тип', // Type
        dataIndex: 'type',
        key: 'type',
        render: (text) => text || '',
    },
    {
      title: 'Номер сделки', // Deal Number
      dataIndex: 'dealNumber',
      key: 'dealNumber',
      render: (text) => text || '',
    },
    {
      title: 'Дата', // Date
      dataIndex: 'date',
      key: 'date',
      render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
        month: "2-digit",
        year: "numeric"
      }).replace(/\./g, "/")}</Text> : ''),
    },
    {
      title: 'Завод', // Factory
      dataIndex: 'factory',
      key: 'factory',
      filters: factories.map(factory => ({ text: factory.name, value: factory.name })),
      onFilter: (value, record) => record.factory === value,
      render: (text) => text || '',
    },
    {
      title: 'Вид ГСМ', // Factory
      dataIndex: 'fuelType',
      key: 'fuelType',
      filters: fuel.map(fuel => ({ text: fuel.name, value: fuel.name })),
      onFilter: (value, record) => record.fuelType === value,
      render: (text) => text || ''
    },
    {
      title: 'Содержание серы, %', // Sulfur Content
      dataIndex: 'sulfur',
      key: 'sulfur',
      render: (text) => text || '',
    },
    {
      title: 'Поставщик', // Supplier Name
      dataIndex: ['Supplier', 'name'],
      key: 'supplierName',
      filters: supplier.map(supplier => ({ text: supplier.name, value: supplier.name })),
      onFilter: (value, record) => record.Supplier.name === value,
      render: (text) => text || '',
    },
    {
      title: '№ договор / приложение', // Supplier Contract Number
      dataIndex: ['Supplier', 'contractNumber'],
      key: 'supplierContractNumber',
      render: (text) => text || '',
    },
    {
      title: 'Законтрактовано по приложению', // Supplier Volume
      dataIndex: ['Supplier', 'volume'],
      key: 'supplierVolume',
      render: (text) => text || '',
    },
    {
      title: 'Сумма по приложению',
      dataIndex: ['Supplier', 'amount'], // Supplier Amount
      key: 'supplierAmount',
      render: (text) => text || '',
    },
    {
      title: 'Базис поставки', // Delivery Basis
      dataIndex: ['Supplier', 'deliveryBasis'],
      key: 'deliveryBasis',
      filters: basis.map(basis => ({ text: basis.name, value: basis.name })),
      onFilter: (value, record) => record.Supplier.deliveryBasis === value,
      render: (text) => text || '',
    },
    {
      title: 'Условия фиксации', // Fixation Condition
      dataIndex: ['Supplier', 'fixationCondition'],
      key: 'fixationCondition',
      filters: condition.map(condition => ({ text: condition.name, value: condition.name })),
      onFilter: (value, record) => record.Supplier.fixationCondition === value,
      render: (text) => text || '',
    },
    {
      title: 'Цены покупки', // Parent column for Supplier Prices
      children: [
        {
          title: 'Валюта',
          key: 'currency',
          render: (record) => {
            const lines = (record.Supplier?.Prices || []).map(
              (price) => price.currency || 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Валюта', // Column for Currency
          key: 'currency',
          render: (record) => {
            const lines = (record.Supplier?.Prices || []).map((price) =>
              price.currency ?? 'Пусто'
            );
            // Use '\n' for line breaks
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Коммент', // Column for Quotation
          key: 'commentary',
          render: (record) => {
            const lines = (record.Supplier?.Prices || []).map((price) =>
              price.commentary ?? 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Котировка', // Column for Quotation
          key: 'quotation',
          render: (record) => {
            const lines = (record.Supplier?.Prices || []).map((price) =>
              price.quotation ?? 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Скидка', // Column for Discount
          key: 'discount',
          render: (record) => {
            const lines = (record.Supplier?.Prices || []).map((price) =>
              price.discount ?? 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Цена', // Column for Price
          key: 'price',
          render: (record) => {
            // If price.price is null, we do (quotation - discount)
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
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
      title: 'Налив поставщик', // Parent column for Supplier Shipment
      children: [
        {
          title: 'Тонн', // Column for Tonn
          key: 'buyTonn',
          render: (record) => {
            // Collect all tonn.tonn into an array
            const lines = (record.Supplier?.Tonns || []).map((tonn) => tonn.tonn || '');
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Дата', // Column for Date
          key: 'buyDate',
          render: (record) => {
            const lines = (record.Supplier?.Tonns || []).map((tonn) =>
              tonn.date ? new Date(tonn.date).toLocaleDateString() : ''
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
      title: 'Сумма налива', // Supplier Amount
      key: 'supplierAmount1',
      render: (record) => {
        // 1) Build an array of strings with each computed amount
        const lines = (record.Supplier?.Prices || []).map((price, index) => {
          const tonn = record.Supplier?.Tonns?.[index]?.tonn;
          // Parse price & tonn
          const priceValue = Number(price.price) || 0;
          const tonnValue = tonn ? Number(tonn.replace(',', '.')) : 0;
          // Multiply
          const amount = priceValue * tonnValue;
          return amount.toFixed(2); // e.g. "123.45"
        });
    
        // 2) Join with newlines
        const multiLineText = lines.join('\n');
    
        // 3) Render in a single <div>
        return (
          <div style={{ whiteSpace: 'pre-wrap', padding: 0 }}>
            {multiLineText}
          </div>
        );
      },
    },
    {
      title: 'Оплата поставщик', // Parent column for Supplier Shipment
      children: [
        {
          title: 'Сумма', // Column for Tonn
          key: 'paymentSupp',
          render: (record) => {
            // Gather each payment value
            const lines = (record.Supplier?.Payments || []).map(
              (p) => p.payment != null ? p.payment.toString() : ''
            );
            // Join them with newlines
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Дата оплаты', // Column for Date
          key: 'suppDate',
          render: (record) => {
            const lines = (record.Supplier?.Payments || []).map(
              (p) => (p.date ? new Date(p.date).toLocaleDateString() : '')
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
      filters: companyGroup.map(company => ({ text: company.name, value: company.name })),
      onFilter: (value, record) => {
        const names = record.CompanyGroup.names ? record.CompanyGroup.names.split(',') : [];
        return names[0] === value;
      },
      render: (text) => {
        const names = text ? text.split(',') : [];
        return names[0] || ''; // Render the first name
      },
    },
    {
      title: 'Цена', // Parent column for Supplier Prices
      children: [
        {
          title: 'Валюта',
          key: 'currency',
          render: (record) => {
            const lines = (record.CompanyGroup?.Prices || []).map(
              (price) => price.currency || 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Валюта', // Column for Currency
          key: 'currency',
          render: (record) => {
            const lines = (record.CompanyGroup?.Prices || []).map((price) =>
              price.currency ?? 'Пусто'
            );
            // Use '\n' for line breaks
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Коммент', // Column for Quotation
          key: 'commentary',
          render: (record) => {
            const lines = (record.CompanyGroup?.Prices || []).map((price) =>
              price.commentary ?? 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Котировка', // Column for Quotation
          key: 'quotation',
          render: (record) => {
            const lines = (record.CompanyGroup?.Prices || []).map((price) =>
              price.quotation ?? 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Скидка', // Column for Discount
          key: 'discount',
          render: (record) => {
            const lines = (record.CompanyGroup?.Prices || []).map((price) =>
              price.discount ?? 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Цена', // Column for Price
          key: 'price',
          render: (record) => {
            // If price.price is null, we do (quotation - discount)
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
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
      title: 'Группа компании 2', // Second name column
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
      title: 'Покупатель', // Buyer Name
      dataIndex: ['Buyer', 'name'],
      key: 'buyerName',
      filters: buyer.map(buyer => ({ text: buyer.name, value: buyer.name })),
      onFilter: (value, record) => record.Buyer.name === value,
      render: (text) => text || '',
    },
    {
      title: 'Номер контракта покупателя', // Buyer Contract Number
      dataIndex: ['Buyer', 'contractNumber'],
      key: 'buyerContractNumber',
      render: (text) => text || '',
    },
    {
      title: 'Объем покупателя', // Buyer Volume
      dataIndex: ['Buyer', 'volume'],
      key: 'buyerVolume',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Законтракт. на сумму', // Buyer Amount
      key: 'buyerAmount',
      render: (record) => {
        return formatNumber(Number(record?.Buyer?.Prices[0]?.price) * Number(record?.Buyer?.volume))
      } 
    },
    {
      title: 'Базис поставки', // Delivery Basis
      dataIndex: ['Buyer', 'deliveryBasis'],
      key: 'deliveryBasis',
      filters: basis.map(basis => ({ text: basis.name, value: basis.name })),
      onFilter: (value, record) => record.Buyer.deliveryBasis === value,
      render: (text) => text || '',
    },
    {
      title: 'Станция назначения', // Delivery Basis
      dataIndex: ['Buyer', 'destinationStation'],
      key: 'destinationStation',
      filters: destination.map(destination => ({ text: destination.name, value: destination.name })),
      onFilter: (value, record) => record.Buyer.destinationStation === value,
      render: (text) => text || '',
    },
    {
      title: 'Условия фиксации', // Fixation Condition (Buyer)
      dataIndex: ['Buyer', 'fixationCondition'],
      key: 'buyerFixationCondition',
      filters: condition.map(condition => ({ text: condition.name, value: condition.name })),
      onFilter: (value, record) => record.Buyer.fixationCondition === value,
      render: (text) => text || '',
    },
    {
      title: 'Цена продажи', // Parent column for Supplier Prices
      children: [
        {
          title: 'Валюта',
          key: 'currency',
          render: (record) => {
            const lines = (record.Buyer?.Prices || []).map(
              (price) => price.currency || 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Валюта', // Column for Currency
          key: 'currency',
          render: (record) => {
            const lines = (record.Buyer?.Prices || []).map((price) =>
              price.currency ?? 'Пусто'
            );
            // Use '\n' for line breaks
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Коммент', // Column for Quotation
          key: 'commentary',
          render: (record) => {
            const lines = (record.Buyer?.Prices || []).map((price) =>
              price.commentary ?? 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Котировка', // Column for Quotation
          key: 'quotation',
          render: (record) => {
            const lines = (record.Buyer?.Prices || []).map((price) =>
              price.quotation ?? 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Скидка', // Column for Discount
          key: 'discount',
          render: (record) => {
            const lines = (record.Buyer?.Prices || []).map((price) =>
              price.discount ?? 'Пусто'
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Цена', // Column for Price
          key: 'price',
          render: (record) => {
            // If price.price is null, we do (quotation - discount)
            const lines = (record.Buyer?.Prices || []).map((price) => {
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
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
      title: 'Заявленный объем', // Declared Volume
      dataIndex: ['Buyer', 'declared'],
      key: 'declaredVolume',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Отгрузка покупателя', // Parent column for Buyer Shipment
      children: [
        {
          title: 'Тонн', // Column for Tonn
          key: 'buyTonn',
          render: (record) => {
            // Collect all tonn.tonn into an array
            const lines = (record.Buyer?.Tonns || []).map((tonn) => tonn.tonn || '');
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Дата', // Column for Date
          key: 'buyDate',
          render: (record) => {
            const lines = (record.Buyer?.Tonns || []).map((tonn) =>
              tonn.date ? new Date(tonn.date).toLocaleDateString() : ''
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
      title: 'Отгружено на сумму', // Buyer Amount
      key: 'buyerAmount6',
      render: (record) => {
        // 1) Build an array of strings for each price
        const lines = (record.Buyer?.Prices || []).map((price, index) => {
          // Safely get tonn
          const tonn = record.Buyer?.Tonns?.[index]?.tonn;
          // Parse out the numeric value
          const priceValue = Number(price.price) || 0;
          const tonnValue = tonn ? Number(tonn.replace(',', '.')) : 0;
          // Multiply
          const amount = priceValue * tonnValue;
          // Return a formatted string
          return amount.toFixed(2); // e.g. "123.45"
        });
    
        // 3) Render in a <div> with pre-wrap
        return (
          <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
      title: 'Оплата покупатель', // Parent column for Supplier Shipment
      children: [
        {
          title: 'Сумма', // Column for Tonn
          key: 'paymentSupp',
          render: (record) => {
            // Gather each payment value
            const lines = (record.Buyer?.Payments || []).map(
              (p) => p.payment != null ? p.payment.toString() : ''
            );
            // Join them with newlines
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
          title: 'Дата оплаты', // Column for Date
          key: 'suppDate',
          render: (record) => {
            const lines = (record.Buyer?.Payments || []).map(
              (p) => (p.date ? new Date(p.date).toLocaleDateString() : '')
            );
            return (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {/* The visible text */}
                    {line}
                    
                    {i < lines.length - 1 && (
                      <>
                        {/* 1) A <br/> for the user’s visible line break */}
                        <br />
                        
                        {/* 2) Insert “//” in the DOM, but hidden */}
                        <span
  style={{
    display: 'inline-block',
    fontSize: 0,          // text is 0 size
    lineHeight: 0,        // no line-height
    overflow: 'hidden',   // hide any possible pixels
    color: 'transparent', // fallback to ensure it's invisible
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
    {
      title: 'Экспедитор', // Forwarder Name
      dataIndex: ['Forwarder', 'name'],
      key: 'forwarderName',
      render: (text) => text || '',
    },
    {
      title: 'Компания группы', // Group Company
      dataIndex: ['Forwarder', 'groupCompany'],
      key: 'groupCompany',
      render: (text) => text || '',
    },
    {
      title: 'ж/д тариф план', // Planned Railway Tariff
      dataIndex: ['Forwarder', 'plannedRailwayTariff'],
      key: 'plannedRailwayTariff',
      render: (text) => text || '',
    },
    {
      title: 'ж/д тариф факт', // Actual Railway Tariff
      dataIndex: ['Forwarder', 'actualRailwayTariff'],
      key: 'actualRailwayTariff',
      render: (text) => text || '',
    },
    {
      title: 'Фактически отгруженный объем, МТ',
      children: [
        {
          title: 'Дата',
          dataIndex: ['Forwarder', 'actualShippedVolumeMTDate'],
          key: 'actualShippedVolumeMTDate',
          render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
            month: "2-digit",
            year: "numeric"
          }).replace(/\./g, "/")}</Text> : ''),
        },
        {
          title: 'Значение',
          dataIndex: ['Forwarder', 'actualShippedVolumeMT'],
          key: 'actualShippedVolumeMT',
        },
      ],
    },
    {
      title: 'Факт. объем по счету-фактуре, МТ',
      children: [
        {
          title: 'Дата',
          dataIndex: ['Forwarder', 'actualVolumeInvoiceMTDate'],
          key: 'actualVolumeInvoiceMTDate',
          render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
            month: "2-digit",
            year: "numeric"
          }).replace(/\./g, "/")}</Text> : ''),
        },
        {
          title: 'Значение',
          dataIndex: ['Forwarder', 'actualVolumeInvoiceMT'],
          key: 'actualVolumeInvoiceMT',
        },
      ],
    },
    {
      title: 'Сумма по счету-фактуре на фактич. объем',
      children: [
        {
          title: 'Дата',
          dataIndex: ['Forwarder', 'invoiceAmountActualVolumeDate'],
          key: 'invoiceAmountActualVolumeDate',
          render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
            month: "2-digit",
            year: "numeric"
          }).replace(/\./g, "/")}</Text> : ''),
        },
        {
          title: 'Значение',
          dataIndex: ['Forwarder', 'invoiceAmountActualVolume'],
          key: 'invoiceAmountActualVolume',
        },
      ],
    },
    {
      title: 'Охрана', // Security
      dataIndex: ['Forwarder', 'security'],
      key: 'security',
      render: (text) => text || '',
    },
    {
      title: 'Сверхнормативы (высокое)', // Excess High
      dataIndex: ['Forwarder', 'excessHigh'],
      key: 'excessHigh',
      render: (text) => text || '',
    },
    {
      title: 'Сверхнормативы (переведенное)', // Excess Transferred
      dataIndex: ['Forwarder', 'excessTransferred'],
      key: 'excessTransferred',
      render: (text) => text || '',
    },
    {
      title: 'Штрафы (высокое)', // Penalties High
      dataIndex: ['Forwarder', 'penaltiesHigh'],
      key: 'penaltiesHigh',
      render: (text) => text || '',
    },
    {
      title: 'Штрафы (переведенные)', // Penalties Transferred
      dataIndex: ['Forwarder', 'penaltiesTransferred'],
      key: 'penaltiesTransferred',
      render: (text) => text || '',
    },
    {
        title: 'Дополнительные расходы', // Additional Costs
        dataIndex: ['Forwarder', 'additionalCosts'],
        key: 'additionalCosts',
        render: (text) => text || '',
    },
    {
        title: 'Заполненный объем', // Volume Filled
        dataIndex: ['Forwarder', 'volumeFilled'],
        key: 'volumeFilled',
        render: (text) => formatNumber(text),
    },
    {
        title: 'Дата загрузки', // Fill Date
        dataIndex: ['Forwarder', 'fillDate'],
        key: 'forwarderFillDate',
        render: (text) => (text ? <Text>{new Date(text).toLocaleDateString("ru-RU", {
          month: "2-digit",
          year: "numeric"
        }).replace(/\./g, "/")}</Text> : ''),
    },
  ]
  
  const exportToExcel = () => {
      if (!tableRef.current) {
        console.warn('No table container found');
        return;
      }
  
      // a) Grab the actual <table> element inside the antd structure
      //    Sometimes AntD renders multiple nested <table>. In simpler usage,
      //    there's typically one <table> for the data.
      const tableElem = tableRef.current.querySelector('table');
      if (!tableElem) {
        console.warn('No <table> element found inside container');
        return;
      }
  
      // b) Convert that table to a SheetJS worksheet
      const worksheet = XLSX.utils.table_to_sheet(tableElem);
      console.log(worksheet)
      Object.keys(worksheet).forEach((cellAddr) => {
        // skip !ref, !cols, etc.
        if (cellAddr[0] === '!') return;
        
        const cell = worksheet[cellAddr];
        if (typeof cell.v === 'string') {
          // If the string contains //, replace with \n
          if (cell.v.includes('//')) {
            cell.v = cell.v.replace(/\/\/+/g, '\n');
            // Enable wrapText so Excel shows multi-line
            cell.s = cell.s || {};
            cell.s.alignment = cell.s.alignment || {};
            cell.s.alignment.wrapText = true;
          }
        }
      });
      console.log(worksheet)
      // c) Build a new workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
      // d) Trigger the download
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
      <Button onClick={exportToExcel} className="mt-4">
        Экспорт в Excel
      </Button>
    </>
  );
};

export default KZPassport;