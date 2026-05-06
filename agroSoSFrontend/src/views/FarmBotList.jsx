import { Header } from '../components/Header';
import { DeviceListPanel } from '../components/DeviceListPanel';
import farmbotIcon from '../assets/img/farmbot_icon.png';

function FarmBotList() {
  return (
    <>
      <Header />
      <DeviceListPanel
        type="FarmBot"
        accentColor="#4CAF50"
        icon={farmbotIcon}
        basePath="farmbot"
      />
    </>
  );
}

export default FarmBotList;
