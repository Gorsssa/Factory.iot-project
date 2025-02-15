export interface SensorData {
  id: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

class SensorStore {
  private data: SensorData[] = [];
  private listeners: (() => void)[] = [];
  private counter = 0;
  private spikeCounter = 0;

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getData() {
    return this.data.slice(-60); // Last 60 readings
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  addReading() {
    this.spikeCounter++;
    
    // Create temperature spikes every 30 seconds
    const shouldSpike = this.spikeCounter % 30 === 0;
    const baseTemp = shouldSpike ? 41 + Math.random() * 2 : 20 + Math.random() * 5;
    
    const reading: SensorData = {
      id: ++this.counter,
      temperature: baseTemp,
      humidity: 40 + Math.random() * 20,
      timestamp: new Date().toISOString()
    };

    this.data.push(reading);
    if (this.data.length > 60) {
      this.data.shift();
    }
    this.notify();
  }
}

export const sensorStore = new SensorStore();

// Simulate sensor readings
setInterval(() => {
  sensorStore.addReading();
}, 1000);