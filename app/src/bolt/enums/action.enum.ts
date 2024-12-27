enum Action {
  SYNC_USERS = "sync_users",
  CLEAR_DATABASE = "clear_database",
  SET_OFFICE_PRESENCE = "set_office_presence",
  SET_REMOTE_PRESENCE = "set_remote_presence",
  SELECT_OFFICE_FOR_DATE = "select_office_for_date",
  DAY_LIST_ITEM_OVERFLOW = "day_list_item_overflow",
  SET_OFFICE_FILTER_VALUE = "set_office_filter_value",
  SET_DATE_FILTER_VALUE = "set_date_filter_value",
  SET_USER_GROUP_FILTER_VALUE = "set_user_group_filter_value",
  OPEN_PRESENCE_VIEW = "open_presence_view",
  OPEN_REGISTRATION_VIEW = "open_registration_view",
  OPEN_SETTINGS_VIEW = "open_settings_view",
  OPEN_OFFICE_MANAGEMENT_MODAL = "open_office_management_modal",
  OPEN_ADD_OFFICE_MODAL = "open_add_office_modal",
  OPEN_EDIT_OFFICE_MODAL = "open_edit_office_modal",
  DELETE_OFFICE = "delete_office",
}

export default Action;
