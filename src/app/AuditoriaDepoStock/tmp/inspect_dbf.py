import struct
import datetime

def inspect_dbf(file_path):
    with open(file_path, 'rb') as f:
        # DBF Header: Version(1), Date(3), NumRecords(4), HeaderLen(2), RecordLen(2)
        header_data = f.read(32)
        if len(header_data) < 32:
            print("File too short")
            return

        version, year, month, day, num_records, header_len, record_len = struct.unpack('<BBBB I H H', header_data[:12])
        
        print(f"Version: {version}")
        print(f"Last update: {year+1900}-{month:02d}-{day:02d}")
        print(f"Number of records: {num_records}")
        print(f"Header length: {header_len}")
        print(f"Record length: {record_len}")

        # Read field descriptors
        num_fields = (header_len - 33) // 32
        fields = []
        for i in range(num_fields):
            field_data = f.read(32)
            if field_data[0] == 0x0D: # End of field descriptors
                break
            name = field_data[:11].decode('ascii').strip('\x00').strip()
            field_type = chr(field_data[11])
            length = field_data[16]
            fields.append({'name': name, 'type': field_type, 'length': length})
            print(f"Field {i+1}: {name} ({field_type}), Length: {length}")

        # Read sample records from the middle
        middle_start = num_records // 2
        f.seek(header_len + (middle_start * record_len))
        print(f"\nSample records (starting from record {middle_start}):")
        found_description = False
        for i in range(min(50, num_records - middle_start)):
            record_data = f.read(record_len)
            if not record_data:
                break
            offset = 1
            record_values = {}
            for field in fields:
                val = record_data[offset:offset+field['length']].decode('latin-1').strip()
                record_values[field['name']] = val
                offset += field['length']
            
            if record_values.get('DENOMINAC'):
                found_description = True
                print(record_values)
        
        if not found_description:
            print(f"\nWARNING: No descriptions found in 50 records starting from {middle_start}.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        inspect_dbf(sys.argv[1])
    else:
        print("Usage: python inspect_dbf.py <file_path>")
