import React, { useState, useEffect } from 'react';
import { Form, Input, Button, List, message } from 'antd';
import refService from '../services/refService';
import { CompactPicker } from 'react-color';


const RefForm = ({ field, title, color = false }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff'); // Default color

  useEffect(() => {
    fetchItems();                     
  }, [field]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await refService.getRef(field); // Assuming `refService` is correctly defined
      setItems(response.data);
    } catch (error) {
      message.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const itemData = { field, name: data.name };
      if (color) itemData.color = selectedColor; // Include color only if `color` prop is true
      
      await refService.createRef(itemData); // Assuming `refService` is correctly defined
      message.success('Успешно добавлено!');
      form.resetFields();
      setSelectedColor('#ffffff'); // Reset color to default after submission
      fetchItems();
    } catch (error) {
      message.error('Не получилось добавить!');
    }
  };

  const handleDelete = async (id) => {
    try {
      await refService.deleteRef(id); // Assuming `refService` is correctly defined
      message.success('Item deleted successfully');
      fetchItems();
    } catch (error) {
      message.error('Failed to delete item');
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <h2 className="font-semibold text-2xl">{title}</h2>
      <Form form={form} onFinish={onSubmit}>
        <Form.Item label="Название" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        {/* Render color picker only if the `color` prop is true */}
        {color && (
          <div className='flex flex-col mb-4'>
            <label>Цвет:</label>
            <CompactPicker
              color={selectedColor}
              onChangeComplete={(color) => setSelectedColor(color.hex)}
            />
          </div>
        )}
        
        <Button type="primary" htmlType="submit">Добавить</Button>
      </Form>

      <List
        loading={loading}
        dataSource={items}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleDelete(item.id)}>Удалить</Button>
            ]}
          >
            <div className="flex items-center space-x-4">
              <span>{item.name}</span>
              
              {/* Display color only if `color` prop is true and item has a color */}
              {color && item.color && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: item.color || '#ffffff', // Default color if undefined
                    borderRadius: '50%',
                    border: '1px solid #e0e0e0'
                  }}
                />
              )}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default RefForm;