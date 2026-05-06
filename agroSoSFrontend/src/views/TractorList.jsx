import { Header } from '../components/Header';
import { DeviceListPanel } from '../components/DeviceListPanel';
import tractorIcon from '../assets/img/tractor_icon.png';

function TractorList() {
  return (
    <>
      <Header />
      <DeviceListPanel
        type="Tractor"
        accentColor="#fbc02d"
        icon={tractorIcon}
        basePath="tractor"
      />
    </>
  );
}

export default TractorList;
