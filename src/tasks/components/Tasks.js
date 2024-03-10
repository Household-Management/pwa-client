import {Box, Drawer, Paper, Toolbar} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useState} from "react";
import {styled} from "@mui/system";

function Tasks(props) {
    const [tasks, setTasks] = useState([]);
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }
    return <Box style={{width: "100%"}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" style={{width: "100%"}}>
                <Tab value={0} label="One"/>
                <Tab value={1} label="Two"/>
                <Tab value={2} label="Three"/>
            </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            1
        </TabPanel>
        <TabPanel value={value} index={1}>
            2
        </TabPanel>
        <TabPanel value={value} index={2}>
            3
        </TabPanel>
    </Box>

}


const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#80BFFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
    800: '#004C99',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

function TabPanel(props) {
    const {children, value, index, ...other} = props;
    return <div
        role="tabpanel"
        hidden={value !== index}
        {...other}
    >
        {value === index && (
            <Box sx={{p: 3}}>{children}</Box>
        )
        }
    </div>
}

export default Tasks;