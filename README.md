# Smart Home IoT

Aplicativo desenvolvido em React Native com Expo para monitoramento e controle de dispositivos IoT utilizando o protocolo MQTT. O sistema recebe dados de sensores de temperatura, umidade e estado da iluminação em tempo real através de um broker MQTT, permitindo também o armazenamento local do histórico de leituras.

Link do vídeo de explicação: https://youtu.be/rWgYzATC_gc

PARTE 2 (DASHBOARD): https://youtu.be/8lmAEaUpwhc

---

## Funcionalidades

- Monitoramento de temperatura, umidade e iluminação em tempo real
- Comunicação via protocolo MQTT
- Armazenamento local do histórico utilizando AsyncStorage
- Visualização do histórico de leituras

---

## Tecnologias Utilizadas

### Frontend
- React Native
- Expo
- JavaScript
- React Navigation

---

## Tópicos MQTT Utilizados

| Tópico | Descrição |
|---------|-----------|
| `casa/temp` | Temperatura |
| `casa/umid` | Umidade |
| `casa/luz` | Estado da iluminação |

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/gabrielzianialves/iot-mqtt-app.git
cd iot-mqtt-app
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Instalar React Navigation

```bash
npx expo install @react-navigation/native
```

```bash
npx expo install react-native-screens react-native-safe-area-context
```

```bash
npm install @react-navigation/native-stack
```

### 4. Instalar AsyncStorage

```bash
npx expo install @react-native-async-storage/async-storage
```

### 5. Executar o projeto

Para executar o projeto, aperte em "Connect" no Broker MQTT.

```bash
npx expo start
```

---

## Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_MQTT_HOST=seu_broker.s1.eu.hivemq.cloud
EXPO_PUBLIC_MQTT_PORT=8884
EXPO_PUBLIC_MQTT_PATH=/mqtt
EXPO_PUBLIC_MQTT_USER=seu_usuario
EXPO_PUBLIC_MQTT_PASS=sua_senha
```

---

## Broker MQTT

O projeto utiliza o broker MQTT HiveMQ Cloud para comunicação entre os dispositivos IoT e o aplicativo.

Exemplo de configuração:

```env
EXPO_PUBLIC_MQTT_HOST=xxxxxxxxxxxxxxxx.s1.eu.hivemq.cloud
EXPO_PUBLIC_MQTT_PORT=8884
EXPO_PUBLIC_MQTT_USER=usuario
EXPO_PUBLIC_MQTT_PASS=senha
```
---

## Estrutura do Projeto

```text
src/
├── components/
│   ├── Gauges.js
│   ├── HistoryCard.js
│   ├── LightControl.js
│   └── StatusModal.js
│
├── screens/
│   ├── HomeScreen.js
│   └── HistoryScreen.js
│
├── services/
│   └── mqttService.js
│
└── App.js
```
