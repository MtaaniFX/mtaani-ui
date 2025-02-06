import {alpha, styled} from "@mui/material/styles";

const NotificationButton = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `9999px`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: alpha(theme.palette.background.default, 0.4),
    boxShadow: theme.shadows[1],
    padding: '8px 20px',
    fontFamily: 'Inter',
    cursor: 'pointer',
    width: 'fit-content',
}));

export default NotificationButton;
