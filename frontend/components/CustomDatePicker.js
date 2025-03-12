import { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

const CustomDatePicker = ({ isVisible, date, onConfirm, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const generateDateArrays = () => {
    const currentYear = new Date().getFullYear();
    return {
      years: Array.from({ length: 100 }, (_, i) => currentYear - i),
      months: Array.from({ length: 12 }, (_, i) => i + 1),
      days: Array.from(
        { length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() },
        (_, i) => i + 1
      )
    };
  };

  const handleDateChange = (type, value) => {
    const newDate = new Date(selectedDate);
    switch (type) {
      case 'year':
        newDate.setFullYear(value);
        break;
      case 'month':
        newDate.setMonth(value - 1);
        break;
      case 'day':
        newDate.setDate(value);
        break;
    }
    setSelectedDate(newDate);
  };

  const renderPickerColumn = (type, items, currentValue) => {
    const getValue = () => {
      switch (type) {
        case 'year': return selectedDate.getFullYear();
        case 'month': return selectedDate.getMonth() + 1;
        case 'day': return selectedDate.getDate();
      }
    };

    return (
      <View style={styles.pickerColumn}>
        <Text style={styles.pickerLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        <ScrollView style={styles.scrollView}>
          {items.map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.pickerItem,
                item === getValue() && styles.selectedItem
              ]}
              onPress={() => handleDateChange(type, item)}
            >
              <Text style={[
                styles.pickerItemText,
                item === getValue() && styles.selectedItemText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const { years, months, days } = generateDateArrays();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.pickerContainer}>
            {renderPickerColumn('year', years)}
            {renderPickerColumn('month', months)}
            {renderPickerColumn('day', days)}
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton]} 
              onPress={() => onConfirm(selectedDate)}
            >
              <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: height * 0.6, // Limit height to 60% of screen height
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.4, // Limit picker height to 40% of screen height
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  scrollView: {
    maxHeight: height * 0.35, // Limit scroll view height
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  pickerItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 2,
  },
  pickerItemText: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedItem: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  selectedItemText: {
    color: 'white',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    minWidth: 90,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#28a745',
  },
  confirmButtonText: {
    color: 'white',
  },
});

export default CustomDatePicker;
