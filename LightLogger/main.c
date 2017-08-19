/*
 * LightLogger.c
 *
 * Created: 8/19/2017 5:53:22 PM
 * Author : paul
 */ 

#include <avr/io.h>
#include <util/delay.h>

#define F_CPU 16E6UL
#define FOSC 16E6 // Clock Speed
#define BAUD 9600
#define MYUBRR FOSC/16/BAUD-1

void USART_Init( unsigned int ubrr);
void USART_Transmit( unsigned char data );
void printByte(uint8_t byte);

int main(void)
{
	ADCSRA |= (1 << ADEN);
	
	//configure ADC prescaler /8
	ADCSRA &= ~(1 << ADPS2);
	ADCSRA |= (0b11);
	
    ADMUX |= (0b101 << MUX0);			// ADC channel 5
	ADMUX |= (1 << REFS0);				// Voltage reference = AVCC
	
	USART_Init(MYUBRR);
	
	uint8_t lightlevel;
	uint16_t adcValue;
	
    while (1) 
    {
		ADCSRA |= (1 << ADSC);			// start ADC conversion
		while (!(ADCSRA & (1 << ADSC))){
			;
		}
		adcValue = ADC;
		lightlevel = (adcValue >> 7);
		
		printByte(lightlevel);
		USART_Transmit('\n');
		_delay_ms(1000);
    }
}

void USART_Init( unsigned int ubrr)
{
	/*Set baud rate */
	UBRR0H = (unsigned char)(ubrr>>8);
	UBRR0L = (unsigned char)ubrr;
	/*Enable receiver and transmitter */
	UCSR0B = (1<<RXEN0)|(1<<TXEN0);
	
	UCSR0C = (1 << UCSZ01) | (1 << UCSZ00);   /* 8 data bits, 1 stop bit */
}

void USART_Transmit( unsigned char data )
{
	/* Wait for empty transmit buffer */
	while ( !( UCSR0A & (1<<UDRE0)) )
	;
	/* Put data into buffer, sends the data */
	UDR0 = data;
}

void printByte(uint8_t byte){
	/* Converts a byte to a string of decimal text, sends it */
	USART_Transmit('0'+ (byte/100)); /* Hundreds */
	USART_Transmit('0'+ ((byte/10) % 10)); /* Tens */
	USART_Transmit('0'+ (byte % 10)); /* Ones */
}
