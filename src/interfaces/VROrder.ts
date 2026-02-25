export interface VROrder {
  additional_operator: string | null;
  additional_phone: string | null;
  additional_phone_ported: boolean | null;
  additional_phone_porting_date: string | null;
  additional_phone_valid: boolean | number | null;
  address_info: {
    address: string;
    block?: string | null;
    building_or_house: string;
    city: string;
    complement: string;
    district: string;
    floor: string;
    lot?: string | null;
    number: string;
    reference_point?: string | null;
    single_zip_code: number;
    state: string;
    zip_code: string;
    zip_code_type: string;
  };
  after_sales_status: string | null;
  capital_social: string | null;
  client_ip: string;
  cnpj: string;
  company_name: string;
  company_size: string | null;
  cpf: string;
  created_at: string;
  email: string;
  fingerprint: {
    browser: {
      name: string;
      version: string;
    };
    device: string;
    os: {
      name: string;
      version: string;
    };
    resolution: {
      dpr: number;
      height: number;
      width: number;
    };
    timezone: string;
    timezone_name: string;
    timezone_offset: number;
  };
  fingerprint_id: string | null;
  full_name: string;
  geolocation: {
    formatted_address: string;
    latitude: string;
    longitude: string;
    maps_link: string;
    precision: string;
    queried_at: string;
    street_view_link: string;
    success: boolean;
  } | null;
  id: number;
  id_order: number | null;
  ip_access_type: string | null;
  ip_as: string | null;
  ip_isp: string | null;
  ip_org: string | null;
  is_email_valid: boolean | 0 | 1;
  is_mei: boolean | null;
  is_socio: boolean | null;
  obs: string | null;
  operator: string;
  order_number: number;
  order_type: string;
  phone: string;
  phone_ported: string;
  phone_porting_date: string | null;
  phone_valid: boolean | 0 | 1;
  responsible_name: string;
  rfb_birth_date: string | null;
  rfb_gender: string | null;
  rfb_name: string;
  rfb_status: string;
  socios_empresas:
    | {
        cpf: string;
        name: string;
        is_admin: string;
      }[]
    | null;
  status: string;
  temperature: number | null;
  updated_at: string;
  url: string | null;
  vr_order: {
    already_has_point_solution: boolean;
    number_of_employees_home: number;
    number_of_employees_office: number;
    point_solution_name: string;
    whats_rh_digital: boolean;
  };
  whatsapp: {
    address: string | null;
    avatar: string;
    category: string | null;
    exists_on_whatsapp: boolean;
    is_commercial: boolean;
    links: string[];
    number: string;
    status_message: string | null;
    success: boolean;
    verified_at: string;
  } | null;
}
