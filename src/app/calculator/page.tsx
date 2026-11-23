import { permanentRedirect } from 'next/navigation';

export default function CalculatorPage(): never {
  permanentRedirect('/shop');
}
