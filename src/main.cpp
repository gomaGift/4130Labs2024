#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <ThreeWire.h>
#include <RtcDS1302.h>

// ==================== RTC Configuration ====================
#define IO_PIN 27
#define SCLK_PIN 14
#define CE_PIN 26

ThreeWire myWire(IO_PIN, SCLK_PIN, CE_PIN);
RtcDS1302<ThreeWire> Rtc(myWire);

// ==================== WiFi Credentials ====================
const char *ssid = "Self-MIFI";
const char *password = "pgaf8754";

// ==================== Server Endpoint ====================
const char *serverURL = "http://borehole-monitoring-system-backend.onrender.com/api/sensor-data";

// ==================== Dallas Temperature Sensor ====================
#define ONE_WIRE_BUS 23
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// ==================== TDS Sensor Configuration ====================
#define TdsSensorPin 34
#define VREF 3.3
#define SCOUNT 30

int analogBuffer[SCOUNT];
int analogBufferTemp[SCOUNT];

float averageVoltage = 0;
float tdsValue = 0;

// ==================== pH Sensor Configuration ====================
float calibration_value = 22.4;
int buffer_arr[10], temp;
float ph_act;

#define PH_PIN 32

// ==================== Utility Functions ====================
#define countof(a) (sizeof(a) / sizeof(a[0]))

String printDateTime(const RtcDateTime &dt)
{
  char datestring[20];
  snprintf_P(datestring, countof(datestring), PSTR("%02u/%02u/%04u %02u:%02u:%02u"),
             dt.Month(), dt.Day(), dt.Year(), dt.Hour(), dt.Minute(), dt.Second());
  return String(datestring);
}

int getMedianNum(int bArray[], int iFilterLen)
{
  int bTab[iFilterLen];
  memcpy(bTab, bArray, iFilterLen * sizeof(int));
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++)
  {
    for (i = 0; i < iFilterLen - j - 1; i++)
    {
      if (bTab[i] > bTab[i + 1])
      {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if (iFilterLen % 2 == 1)
    return bTab[iFilterLen / 2];
  else
    return (bTab[iFilterLen / 2 - 1] + bTab[iFilterLen / 2]) / 2;
}

float readPH()
{
  for (int i = 0; i < 10; i++)
  {
    buffer_arr[i] = analogRead(PH_PIN);
    delay(30);
  }

  // Sort array
  for (int i = 0; i < 9; i++)
  {
    for (int j = i + 1; j < 10; j++)
    {
      if (buffer_arr[i] > buffer_arr[j])
      {
        temp = buffer_arr[i];
        buffer_arr[i] = buffer_arr[j];
        buffer_arr[j] = temp;
      }
    }
  }

  unsigned long int avgval = 0;
  for (int i = 2; i < 8; i++)
    avgval += buffer_arr[i];

  float volt = ((float)avgval / 6) * 3.3 / 4095.0;
  return -5.7 * volt + calibration_value;
}

// ==================== Setup ====================
void setup()
{
  Serial.begin(115200);

  // WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  // while (WiFi.status() != WL_CONNECTED)
  // {
  //   delay(500);
  //   Serial.print(".");
  // }
  Serial.println(" Connected!");

  // DS18B20 Temp
  sensors.begin();
  Serial.print("Found DS18B20 devices: ");
  Serial.println(sensors.getDeviceCount());

  // RTC
  Rtc.Begin();
  if (!Rtc.IsDateTimeValid())
  {
    Serial.println("RTC invalid, setting time.");
    Rtc.SetDateTime(RtcDateTime(__DATE__, __TIME__));
  }

  pinMode(TdsSensorPin, INPUT);
}

// ==================== Main Loop ====================
void loop()
{
  // ========== Temperature ==========
  sensors.requestTemperatures();
  float waterTemperature = sensors.getTempCByIndex(0);
  Serial.print("Water Temperature: ");
  Serial.print(waterTemperature);
  Serial.println(" °C");

  // ========== TDS ==========
  for (int i = 0; i < SCOUNT; i++)
  {
    analogBuffer[i] = analogRead(TdsSensorPin);
    delay(40);
  }

  memcpy(analogBufferTemp, analogBuffer, sizeof(analogBuffer));
  int median = getMedianNum(analogBufferTemp, SCOUNT);

  averageVoltage = median * VREF / 4095.0;
  float compensationCoefficient = 1.0 + 0.02 * (waterTemperature - 25.0);
  float compensationVoltage = averageVoltage / compensationCoefficient;

  tdsValue = (133.42 * pow(compensationVoltage, 3) - 255.86 * pow(compensationVoltage, 2) + 857.39 * compensationVoltage) * 0.5;

  Serial.print("TDS Value: ");
  Serial.print(tdsValue, 0);
  Serial.println(" ppm");

  // ========== pH ==========
  ph_act = readPH();
  Serial.print("pH Value: ");
  Serial.println(ph_act);

  // ========== Timestamp ==========
  RtcDateTime now = Rtc.GetDateTime();
  String timestamp = printDateTime(now);

  // ========== Send Payload ==========
  String payload = "{";
  payload += "\"ph\": " + String(ph_act, 2) + ",";
  payload += "\"turbidity\": 0,"; // You can replace this if you add turbidity sensor
  payload += "\"tds\": " + String(tdsValue, 2) + ",";
  payload += "\"temperature\": " + String(waterTemperature, 2) + ",";
  payload += "\"timestamp\": \"" + timestamp + "\"";
  payload += "}";

  Serial.println("Sending payload: " + payload);

  if (WiFi.status() == WL_CONNECTED)
  {
    // HTTPClient http;
    // http.begin(serverURL);
    // http.addHeader("Content-Type", "application/json");
    // int httpResponseCode = http.POST(payload);

    // if (httpResponseCode > 0)
    // {
    //   String response = http.getString();
    //   Serial.println("Server response: " + response);
    // }
    // else
    // {
    //   Serial.println("POST failed: " + String(httpResponseCode));
    // }
    // http.end();
  }
  else
  {
    Serial.println("WiFi disconnected!");
  }

  delay(500); // Wait before next loop
}
