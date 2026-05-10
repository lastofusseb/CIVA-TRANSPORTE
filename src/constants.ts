
export const DESTINATIONS = [
  { id: 'chimbote', name: 'Chimbote', region: 'NORTE', econociva: 45, superciva: 65, excluciva: 100, duration: '6h - 7h' },
  { id: 'trujillo', name: 'Trujillo', region: 'NORTE', econociva: 60, superciva: 80, excluciva: 125, duration: '9h - 10h' },
  { id: 'chiclayo', name: 'Chiclayo', region: 'NORTE', econociva: 65, superciva: 90, excluciva: 140, duration: '13h - 14h' },
  { id: 'piura', name: 'Piura', region: 'NORTE', econociva: 70, superciva: 85, excluciva: 160, duration: '17h 30m' },
  { id: 'sullana', name: 'Sullana', region: 'NORTE', econociva: 80, superciva: 100, excluciva: 165, duration: '18h' },
  { id: 'talara', name: 'Talara', region: 'NORTE', econociva: 90, superciva: 115, excluciva: 175, duration: '19h' },
  { id: 'mancora', name: 'Máncora', region: 'NORTE', econociva: 100, superciva: 130, excluciva: 195, duration: '20h' },
  { id: 'tumbes', name: 'Tumbes', region: 'NORTE', econociva: 105, superciva: 145, excluciva: 210, duration: '21h - 22h' },
  { id: 'cajamarca', name: 'Cajamarca', region: 'NORTE', econociva: 80, superciva: 110, excluciva: 155, duration: '15h' },
  { id: 'jaen', name: 'Jaén', region: 'NORTE', econociva: 90, superciva: 120, excluciva: 160, duration: '18h' },
  { id: 'ica', name: 'Ica', region: 'SUR', econociva: 35, superciva: 55, excluciva: 90, duration: '4h - 5h' },
  { id: 'nazca', name: 'Nazca', region: 'SUR', econociva: 60, superciva: 95, excluciva: 150, duration: '7h - 8h' },
  { id: 'arequipa', name: 'Arequipa', region: 'SUR', econociva: 85, superciva: 130, excluciva: 180, duration: '16h 30m' },
  { id: 'moquegua', name: 'Moquegua', region: 'SUR', econociva: 110, superciva: 150, excluciva: 200, duration: '19h' },
  { id: 'tacna', name: 'Tacna', region: 'SUR', econociva: 110, superciva: 170, excluciva: 230, duration: '22h' },
  { id: 'cusco', name: 'Cusco', region: 'SUR', econociva: 100, superciva: 155, excluciva: 205, duration: '21h - 22h' },
  { id: 'abancay', name: 'Abancay', region: 'SUR', econociva: 90, superciva: 130, excluciva: 170, duration: '18h' },
  { id: 'puno', name: 'Puno', region: 'SUR', econociva: 120, superciva: 155, excluciva: 200, duration: '21h' },
  { id: 'huancayo', name: 'Huancayo', region: 'ORIENTE', econociva: 40, superciva: 70, excluciva: 110, duration: '7h - 8h' },
  { id: 'tingo-maria', name: 'Tingo María', region: 'ORIENTE', econociva: 80, superciva: 110, excluciva: 0, duration: '14h' },
  { id: 'tarapoto', name: 'Tarapoto', region: 'ORIENTE', econociva: 130, superciva: 175, excluciva: 220, duration: '26h - 28h' },
  { id: 'chachapoyas', name: 'Chachapoyas', region: 'ORIENTE', econociva: 90, superciva: 130, excluciva: 180, duration: '23h - 24h' },
];

export const BUSINESS_RULES = `
- Temporada Alta (Semana Santa, Fiestas Patrias 25-31 Jul, Navidad): Precio x1.8 a x3.0.
- Cyber Days: Descuento 20% a 40% si compra > 15 días antes.
- Menores: > 5 años pagan completo. < 5 viajan gratis en falda (1 por adulto).
- Equipaje: 20-30kg bodega gratis. Exceso S/ 2.50 por kg.
- Métodos de Pago: Visa, Mastercard, PagoEfectivo, Amex, Diners Club, Yape, UnionPay.
`;
